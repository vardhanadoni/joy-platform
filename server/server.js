// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the DB connection function
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes'); 
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const cors = require('cors');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// --- CORS Configuration ---
// This middleware allows your React frontend to make requests to this backend
app.use(cors({
  origin: 'http://localhost:3000', // <--- IMPORTANT: Allow requests ONLY from your React dev server
  credentials: true // Allow cookies/authorization headers to be sent
}));


// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', authRoutes);
app.use('/api', patientRoutes); 
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', require('./routes/appointmentRoutes'));
// --- Static Files Serving ---
// Serve the 'uploads' folder statically. This is where your documents/images are stored.
// For example, if an image is saved as 'uploads/retinal-image-123.jpg', it can be accessed via http://localhost:5000/uploads/retinal-image-123.jpg
app.use('/uploads', express.static('uploads'));
app.use(errorHandler); 

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});