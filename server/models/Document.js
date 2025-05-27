// server/models/Document.js
const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User who uploaded the document
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String, // Publicly accessible URL path (e.g., '/uploads/filename.ext')
      required: true,
    },
    fileType: {
      type: String, // e.g., 'image/jpeg', 'application/pdf'
      required: true,
    },
    documentType: {
      type: String,
      enum: ['retinal_image', 'prescription', 'id_proof', 'other'], // Categorize document types
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    // If it's a retinal image, we might link to a prediction
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      default: null, // Null if no prediction is associated yet
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;