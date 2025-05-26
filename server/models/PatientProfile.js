// server/models/PatientProfile.js
const mongoose = require('mongoose');

const patientProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: 'User', // The name of the model to which we are referring
      unique: true // Ensures one profile per user
    },
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], // Restrict possible gender values
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String, // Can be a longer text field for various conditions
      default: '',
    },
    currentMedications: {
      type: String, // Optional field
      default: '',
    },
    // Add any other patient-specific fields as needed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);

module.exports = PatientProfile;