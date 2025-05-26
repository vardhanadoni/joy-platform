// server/models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User for whom the prediction was made
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Document', // Reference to the retinal image document that was processed
      unique: true, // Ensures one prediction per retinal image document
    },
    predictionResult: {
      type: String, // e.g., 'No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'
      required: true,
    },
    confidenceScore: {
      type: Number, // Probability score from the model (e.g., 0.0 to 1.0)
      min: 0,
      max: 1,
      default: 0,
    },
    predictionDate: {
      type: Date,
      default: Date.now,
    },
    // You might add more fields here if your model outputs more detailed info
    // For example, severity scores per class, or features extracted
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;