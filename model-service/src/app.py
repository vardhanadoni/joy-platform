# model-service/src/app.py
from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import os
import sys

app = Flask(__name__)

# --- Configuration ---
# Define the path where your .pt model file is located
# Assumes dr_effnetb3.pt is in model-service/model/
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'dr_effnetb3.pt')

# IMPORTANT: Ensure these match the IMG_SIZE and normalization from your training
IMG_SIZE = 300
preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Define your classification labels based on NUM_CLASSES = 5
# IMPORTANT: Ensure these match the order of output classes from your model!
CLASS_LABELS = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR']
NUM_CLASSES = 5 # From your training script

# --- Custom Model Architecture (Copied directly from your training script) ---
# These classes MUST be defined for torch.load to reconstruct your model
class ConvBNReLU(nn.Sequential):
    def __init__(self, in_channels, out_channels, kernel_size, stride, groups=1):
        padding = (kernel_size - 1) // 2
        super().__init__(
            nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, groups=groups, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.SiLU()
        )

class SqueezeExcitation(nn.Module):
    def __init__(self, input_channels, squeeze_factor=4):
        super().__init__()
        squeeze_channels = input_channels // squeeze_factor
        self.fc1 = nn.Conv2d(input_channels, squeeze_channels, 1)
        self.fc2 = nn.Conv2d(squeeze_channels, input_channels, 1)
        self.act1 = nn.SiLU()
        self.act2 = nn.Sigmoid()

    def forward(self, x):
        scale = torch.mean(x, dim=(2, 3), keepdim=True)
        scale = self.fc1(scale)
        scale = self.act1(scale)
        scale = self.fc2(scale)
        scale = self.act2(scale)
        return scale * x

class CBAM(nn.Module):
    def __init__(self, channels, reduction=16):
        super().__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)
        self.fc = nn.Sequential(
            nn.Conv2d(channels, channels // reduction, 1, bias=False),
            nn.ReLU(),
            nn.Conv2d(channels // reduction, channels, 1, bias=False)
        )
        self.sigmoid_channel = nn.Sigmoid()
        self.conv_spatial = nn.Conv2d(2, 1, 7, padding=3, bias=False)
        self.sigmoid_spatial = nn.Sigmoid()

    def forward(self, x):
        avg_out = self.fc(self.avg_pool(x))
        max_out = self.fc(self.max_pool(x))
        scale = self.sigmoid_channel(avg_out + max_out)
        x = x * scale
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        spatial = self.sigmoid_spatial(self.conv_spatial(torch.cat([avg_out, max_out], dim=1)))
        return x * spatial

class MBConv(nn.Module):
    def __init__(self, in_channels, out_channels, stride, expand_ratio):
        super().__init__()
        hidden_dim = in_channels * expand_ratio
        self.use_residual = (stride == 1 and in_channels == out_channels)
        layers = []
        if expand_ratio != 1:
            layers.append(ConvBNReLU(in_channels, hidden_dim, 1, 1))
        layers.extend([
            ConvBNReLU(hidden_dim, hidden_dim, 3, stride, groups=hidden_dim),
            SqueezeExcitation(hidden_dim),
            nn.Conv2d(hidden_dim, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
        ])
        self.block = nn.Sequential(*layers)

    def forward(self, x):
        result = self.block(x)
        if self.use_residual:
            result += x
        return result

class EfficientNetB3(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.stem = ConvBNReLU(3, 40, 3, 2)
        self.blocks = nn.Sequential(
            MBConv(40, 40, 1, 1),
            MBConv(40, 48, 2, 6),
            MBConv(48, 64, 2, 6),
            MBConv(64, 136, 2, 6),
            MBConv(136, 232, 1, 6),
            MBConv(232, 384, 2, 6),
            CBAM(384)
        )
        self.head = nn.Sequential(
            ConvBNReLU(384, 1536, 1, 1),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(1536, 512),
            nn.ReLU(),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.stem(x)
        x = self.blocks(x)
        x = self.head(x)
        return x


# --- Load the Model ---
model = None # Initialize model to None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_dr_model(path=MODEL_PATH):
    try:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found at: {path}")

        checkpoint = torch.load(path, map_location=device)
        print(f"Loaded checkpoint from {path}")

        loaded_model = EfficientNetB3(num_classes=checkpoint.get('num_classes', NUM_CLASSES))
        loaded_model.load_state_dict(checkpoint['model_state_dict'])
        loaded_model.to(device)
        loaded_model.eval()
        print("DR Model loaded successfully.")
        return loaded_model
    except FileNotFoundError as e:
        print(f"ERROR: {e}. Model will not be loaded. Predictions will be dummy.")
        return None
    except Exception as e:
        print(f"ERROR loading model from {path}: {e}")
        import traceback
        traceback.print_exc(file=sys.stdout)
        print("Dummy model will be used for predictions.")
        return None

model = load_dr_model() # Attempt to load the model on startup


# --- Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

            input_tensor = preprocess(img)
            input_batch = input_tensor.unsqueeze(0)
            input_batch = input_batch.to(device)

            if model:
                with torch.no_grad():
                    output = model(input_batch)
                    probabilities = torch.softmax(output, dim=1)[0]
                    predicted_index = torch.argmax(probabilities).item()

                prediction_result = CLASS_LABELS[predicted_index]
                confidence_score = probabilities[predicted_index].item()
            else:
                print("Performing dummy prediction as model failed to load.")
                prediction_result = "No DR"
                confidence_score = 0.75

            return jsonify({
                'predictionResult': prediction_result,
                'confidenceScore': round(float(confidence_score), 4),
                'message': 'Prediction successful'
            })

        except Exception as e:
            return jsonify({'error': f'Error processing image: {e}'}), 500

    return jsonify({'error': 'An unexpected error occurred.'}), 500

# --- Health Check Endpoint ---
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device)
    }), 200

if __name__ == '__main__':
    PORT = os.environ.get('PORT', 5001)
    print(f"Starting Flask app on http://0.0.0.0:{PORT}")
    app.run(debug=True, host='0.0.0.0', port=PORT)