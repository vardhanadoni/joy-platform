// // server/controllers/patientController.js
// const asyncHandler = require('express-async-handler');
// const PatientProfile = require('../models/PatientProfile');
// const Document = require('../models/Document');
// const path = require('path');
// const fs = require('fs'); // Node's file system module for file operations

// /**
//  * @desc    Get patient profile (current user's profile)
//  * @route   GET /api/patient/profile
//  * @access  Private (Patient only)
//  */
// const getPatientProfile = asyncHandler(async (req, res) => {
//   // req.user is set by the protect middleware
//   if (req.user.role !== 'patient') {
//     res.status(403); // Forbidden
//     throw new Error('Access denied. Only patients can view their profile.');
//   }

//   const profile = await PatientProfile.findOne({ user: req.user._id }).populate(
//     'user',
//     'name email' // Populate user's name and email
//   );

//   if (profile) {
//     res.json(profile);
//   } else {
//     // If no profile exists yet, return basic user info and an empty profile indication
//     res.status(200).json({
//       message: 'No patient profile found. Please create one.',
//       user: {
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role,
//       },
//       profile: null, // Indicate that no detailed profile exists yet
//     });
//   }
// });

// /**
//  * @desc    Create or update patient profile
//  * @route   POST /api/patient/profile (create)
//  * @route   PUT /api/patient/profile (update)
//  * @access  Private (Patient only)
//  */
// const createOrUpdatePatientProfile = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can manage their profile.');
//   }

//   const { fullName, dateOfBirth, gender, contactNumber, address, medicalHistory, currentMedications } = req.body;

//   // Basic validation for required fields
//   if (!fullName || !dateOfBirth || !gender || !contactNumber || !address) {
//     res.status(400);
//     throw new Error('Please fill all required profile fields.');
//   }

//   // Find if a profile already exists for this user
//   let profile = await PatientProfile.findOne({ user: req.user._id });

//   if (profile) {
//     // Update existing profile
//     profile.fullName = fullName;
//     profile.dateOfBirth = dateOfBirth;
//     profile.gender = gender;
//     profile.contactNumber = contactNumber;
//     profile.address = address;
//     profile.medicalHistory = medicalHistory || '';
//     profile.currentMedications = currentMedications || '';

//     const updatedProfile = await profile.save();
//     res.json(updatedProfile);
//   } else {
//     // Create new profile
//     profile = await PatientProfile.create({
//       user: req.user._id,
//       fullName,
//       dateOfBirth,
//       gender,
//       contactNumber,
//       address,
//       medicalHistory: medicalHistory || '',
//       currentMedications: currentMedications || '',
//     });

//     res.status(201).json(profile);
//   }
// });


// /**
//  * @desc    Upload a general document (e.g., prescription, ID proof)
//  * @route   POST /api/upload/document
//  * @access  Private (Patient only)
//  */
// const uploadDocument = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can upload documents.');
//   }

//   // Check if file was actually uploaded by multer
//   if (!req.file) {
//     res.status(400);
//     throw new Error('No file uploaded.');
//   }

//   const { documentType } = req.body; // Expect documentType (e.g., 'prescription', 'id_proof', 'other') from frontend

//   if (!documentType || !['prescription', 'id_proof', 'other'].includes(documentType)) {
//     // If the documentType is invalid, delete the uploaded file to prevent clutter
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.error('Error deleting invalid file:', err);
//     });
//     res.status(400);
//     throw new Error('Invalid or missing document type. Must be "prescription", "id_proof", or "other".');
//   }

//   // Create a new Document record in MongoDB
//   const document = await Document.create({
//     user: req.user._id,
//     fileName: req.file.originalname,
//     filePath: req.file.path, // Path where multer saved the file
//     fileType: req.file.mimetype,
//     documentType: documentType,
//   });

//   res.status(201).json({
//     message: 'Document uploaded successfully.',
//     document: document,
//   });
// });


// /**
//  * @desc    Get all documents for the current patient
//  * @route   GET /api/patient/documents
//  * @access  Private (Patient only)
//  */
// const getPatientDocuments = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can view their documents.');
//   }

//   const documents = await Document.find({ user: req.user._id })
//                                   .sort({ uploadDate: -1 }); // Sort by newest first

//   res.json(documents);
// });


// // Note: Retinal image upload and prediction logic will go into a separate controller/function
// // as it involves communication with the Python service.

// module.exports = {
//   getPatientProfile,
//   createOrUpdatePatientProfile,
//   uploadDocument,
//   getPatientDocuments,
// };






// server/controllers/patientController.js
// const asyncHandler = require('express-async-handler');
// const PatientProfile = require('../models/PatientProfile');
// const Document = require('../models/Document');
// const Prediction = require('../models/Prediction'); // <--- ADD THIS LINE
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios'); // <--- ADD THIS LINE to make HTTP requests
// const FormData = require('form-data');

// // --- Configuration for Flask Model Service ---
// const FLASK_MODEL_SERVICE_URL = process.env.FLASK_MODEL_SERVICE_URL || 'http://localhost:5001';


// /**
//  * @desc    Get patient profile (current user's profile)
//  * @route   GET /api/patient/profile
//  * @access  Private (Patient only)
//  */
// const getPatientProfile = asyncHandler(async (req, res) => {
//   // req.user is set by the protect middleware
//   if (req.user.role !== 'patient') {
//     res.status(403); // Forbidden
//     throw new Error('Access denied. Only patients can view their profile.');
//   }

//   const profile = await PatientProfile.findOne({ user: req.user._id }).populate(
//     'user',
//     'name email' // Populate user's name and email
//   );

//   if (profile) {
//     res.json(profile);
//   } else {
//     // If no profile exists yet, return basic user info and an empty profile indication
//     res.status(200).json({
//       message: 'No patient profile found. Please create one.',
//       user: {
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role,
//       },
//       profile: null, // Indicate that no detailed profile exists yet
//     });
//   }
// });

// /**
//  * @desc    Create or update patient profile
//  * @route   POST /api/patient/profile (create)
//  * @route   PUT /api/patient/profile (update)
//  * @access  Private (Patient only)
//  */
// const createOrUpdatePatientProfile = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can manage their profile.');
//   }

//   const { fullName, dateOfBirth, gender, contactNumber, address, medicalHistory, currentMedications } = req.body;

//   // Basic validation for required fields
//   if (!fullName || !dateOfBirth || !gender || !contactNumber || !address) {
//     res.status(400);
//     throw new Error('Please fill all required profile fields.');
//   }

//   // Find if a profile already exists for this user
//   let profile = await PatientProfile.findOne({ user: req.user._id });

//   if (profile) {
//     // Update existing profile
//     profile.fullName = fullName;
//     profile.dateOfBirth = dateOfBirth;
//     profile.gender = gender;
//     profile.contactNumber = contactNumber;
//     profile.address = address;
//     profile.medicalHistory = medicalHistory || '';
//     profile.currentMedications = currentMedications || '';

//     const updatedProfile = await profile.save();
//     res.json(updatedProfile);
//   } else {
//     // Create new profile
//     profile = await PatientProfile.create({
//       user: req.user._id,
//       fullName,
//       dateOfBirth,
//       gender,
//       contactNumber,
//       address,
//       medicalHistory: medicalHistory || '',
//       currentMedications: currentMedications || '',
//     });

//     res.status(201).json(profile);
//   }
// });


// /**
//  * @desc    Upload a general document (e.g., prescription, ID proof)
//  * @route   POST /api/upload/document
//  * @access  Private (Patient only)
//  */
// const uploadDocument = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can upload documents.');
//   }

//   // Check if file was actually uploaded by multer
//   if (!req.file) {
//     res.status(400);
//     throw new Error('No file uploaded.');
//   }

//   const { documentType } = req.body; // Expect documentType (e.g., 'prescription', 'id_proof', 'other') from frontend

//   if (!documentType || !['prescription', 'id_proof', 'other'].includes(documentType)) {
//     // If the documentType is invalid, delete the uploaded file to prevent clutter
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.error('Error deleting invalid file:', err);
//     });
//     res.status(400);
//     throw new Error('Invalid or missing document type. Must be "prescription", "id_proof", or "other".');
//   }

//   // Create a new Document record in MongoDB
//   const document = await Document.create({
//     user: req.user._id,
//     fileName: req.file.originalname,
//     filePath: req.file.path, // Path where multer saved the file
//     fileType: req.file.mimetype,
//     documentType: documentType,
//   });

//   res.status(201).json({
//     message: 'Document uploaded successfully.',
//     document: document,
//   });
// });


// /**
//  * @desc    Upload a retinal image and get prediction
//  * @route   POST /api/upload/retinal-image
//  * @access  Private (Patient only)
//  */
// const uploadRetinalImage = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can upload retinal images.');
//   }

//   if (!req.file) {
//     res.status(400);
//     throw new Error('No retinal image file uploaded.');
//   }

//   const { originalname, path: filePath, mimetype } = req.file;

//   try {
//     // 1. Create Document entry first
//     const retinalDocument = await Document.create({
//       user: req.user._id,
//       fileName: originalname,
//       filePath: filePath, // Local path where Multer saved the image
//       fileType: mimetype,
//       documentType: 'retinal_image',
//     });

//     // 2. Send image to Flask model service for prediction
//     // Create FormData to send the file via HTTP request
//     const FormData = require('form-data'); // Import form-data library
//     const form = new FormData();
//     form.append('file', fs.createReadStream(filePath), originalname); // Append file stream

//     const flaskResponse = await axios.post(`${FLASK_MODEL_SERVICE_URL}/predict`, form, {
//       headers: {
//         ...form.getHeaders() // Important for multipart/form-data
//       }
//     });

//     const { predictionResult, confidenceScore, message } = flaskResponse.data;

//     // 3. Save prediction results to MongoDB
//     const prediction = await Prediction.create({
//       user: req.user._id,
//       document: retinalDocument._id, // Link to the uploaded retinal image document
//       predictionResult,
//       confidenceScore,
//     });

//     // 4. Update the Document with the prediction ID
//     retinalDocument.prediction = prediction._id;
//     await retinalDocument.save();

//     res.status(200).json({
//       message: 'Retinal image uploaded and processed successfully.',
//       document: retinalDocument,
//       prediction: prediction,
//       modelMessage: message, // Message from the Flask service
//     });

//   } catch (error) {
//     console.error('Error during retinal image upload and prediction:', error.message);
//     if (error.response) {
//       console.error('Flask service response data:', error.response.data);
//       console.error('Flask service response status:', error.response.status);
//     }

//     // Crucially: If something goes wrong, clean up the uploaded file and DB entries
//     if (req.file && fs.existsSync(filePath)) {
//       fs.unlink(filePath, (err) => {
//         if (err) console.error('Error deleting failed upload file:', err);
//       });
//     }
//     // Attempt to clean up document and prediction if they were created before failure
//     if (retinalDocument && retinalDocument._id) {
//         await Document.findByIdAndDelete(retinalDocument._id);
//     }
//     if (prediction && prediction._id) {
//         await Prediction.findByIdAndDelete(prediction._id);
//     }

//     res.status(500).json({
//       message: 'Failed to process retinal image or get prediction.',
//       error: error.response ? error.response.data.error : error.message,
//     });
//   }
// });


// /**
//  * @desc    Get all documents for the current patient
//  * @route   GET /api/patient/documents
//  * @access  Private (Patient only)
//  */
// const getPatientDocuments = asyncHandler(async (req, res) => {
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Access denied. Only patients can view their documents.');
//   }

//   const documents = await Document.find({ user: req.user._id })
//                                   .populate('prediction') // Populate prediction details if available
//                                   .sort({ uploadDate: -1 }); // Sort by newest first

//   res.json(documents);
// });


// module.exports = {
//   getPatientProfile,
//   createOrUpdatePatientProfile,
//   uploadDocument,
//   getPatientDocuments,
//   uploadRetinalImage, // <--- ADD THIS FUNCTION TO EXPORTS
// };




// server/controllers/patientController.js
const asyncHandler = require('express-async-handler');
const PatientProfile = require('../models/PatientProfile'); // Ensure this is the correct model name
const User = require('../models/User'); // Used for getting user's initial name/email for profile
const Document = require('../models/Document');
const Prediction = require('../models/Prediction');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // For making HTTP requests to Flask
const FormData = require('form-data'); // For sending files to Flask service

// --- Configuration for Flask Model Service ---
// Ensure this environment variable is set in your server/.env file
const FLASK_MODEL_SERVICE_URL = process.env.FLASK_MODEL_SERVICE_URL || 'http://localhost:5001';


/**
 * @desc    Get patient profile (current user's profile)
 * @route   GET /api/profile  (Note: Changed from /api/patient/profile to match frontend)
 * @access  Private (Patient only)
 */
const getPatientProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403); // Forbidden
    throw new Error('Access denied. Only patients can view their profile.');
  }

  const patientProfile = await PatientProfile.findOne({ user: req.user._id });

  if (!patientProfile) {
    // If no profile exists yet, return basic user info for initial form fill
    // We fetch user details again to ensure consistency and get the user's name/email.
    const user = await User.findById(req.user._id).select('name email'); // Fetch only name and email
    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }
    return res.status(200).json({
      // IMPORTANT: Use 'fullName' and 'contactNumber' to match the PatientProfile model
      fullName: user.name, // Initialize fullName with user's registered name
      // Email is not stored in PatientProfile, fetched directly from User for display purposes
      dateOfBirth: '',
      gender: '',
      address: '',
      contactNumber: '', // Initialize as empty for new profiles
      medicalHistory: '',
      currentMedications: ''
    });
  }

  // If profile exists, return it
  res.status(200).json(patientProfile);
});

/**
 * @desc    Create or update patient profile
 * @route   PUT /api/profile (Note: Changed from /api/patient/profile to match frontend)
 * @access  Private (Patient only)
 */
const createOrUpdatePatientProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403);
    throw new Error('Access denied. Only patients can manage their profile.');
  }

  // Destructure fields using the exact names from your PatientProfile schema
  const {
    fullName,         // Matches schema
    dateOfBirth,
    gender,
    address,
    contactNumber,    // Matches schema
    medicalHistory,
    currentMedications,
  } = req.body;

  // Basic validation for required fields
  // These fields are marked as `required: true` in your PatientProfile model
  if (!fullName || !dateOfBirth || !gender || !address || !contactNumber) {
    res.status(400);
    throw new Error('Please fill all required profile fields.');
  }

  // Find if a profile already exists for this user
  let patientProfile = await PatientProfile.findOne({ user: req.user._id });

  // Data to be updated or created
  const profileFields = {
    fullName,
    dateOfBirth,
    gender,
    address,
    contactNumber,
    medicalHistory: medicalHistory || '', // Use default if not provided
    currentMedications: currentMedications || '', // Use default if not provided
  };

  if (patientProfile) {
    // Update existing profile
    patientProfile = await PatientProfile.findOneAndUpdate(
      { user: req.user._id }, // Query by the user's ID
      { $set: profileFields }, // Use $set to update the specific fields
      { new: true, runValidators: true } // Return the updated document, run schema validators
    );
    return res.status(200).json(patientProfile);
  } else {
    // Create new profile if one doesn't exist
    profileFields.user = req.user._id; // Link the new profile to the user's ID
    const newProfile = await PatientProfile.create(profileFields);
    return res.status(201).json(newProfile);
  }
});


/**
 * @desc    Upload a general document (e.g., prescription, ID proof)
 * @route   POST /api/upload/document
 * @access  Private (Patient only)
 */
const uploadDocument = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403);
    throw new Error('Access denied. Only patients can upload documents.');
  }

  // Check if file was actually uploaded by multer
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const { documentType } = req.body; // Expect documentType (e.g., 'prescription', 'id_proof', 'other') from frontend

  // Validate documentType against allowed values
  if (!documentType || !['prescription', 'id_proof', 'other'].includes(documentType)) {
    // If the documentType is invalid, delete the uploaded file to prevent clutter
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting invalid file:', err);
    });
    res.status(400);
    throw new Error('Invalid or missing document type. Must be "prescription", "id_proof", or "other".');
  }

  // Create a new Document record in MongoDB
  const document = await Document.create({
    user: req.user._id,
    fileName: req.file.originalname,
    filePath: req.file.path, // Path where multer saved the file
    fileType: req.file.mimetype,
    documentType: documentType,
  });

  res.status(201).json({
    message: 'Document uploaded successfully.',
    document: document,
  });
});


/**
 * @desc    Upload a retinal image and get prediction
 * @route   POST /api/upload/retinal-image
 * @access  Private (Patient only)
 */
const uploadRetinalImage = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403);
    throw new Error('Access denied. Only patients can upload retinal images.');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No retinal image file uploaded.');
  }

  const { originalname, path: filePath, mimetype } = req.file;
  let retinalDocument; // Declare outside try-catch for cleanup
  let prediction; // Declare outside try-catch for cleanup

  try {
    // 1. Create Document entry first
    retinalDocument = await Document.create({
      user: req.user._id,
      fileName: originalname,
      filePath: filePath, // Local path where Multer saved the image
      fileType: mimetype,
      documentType: 'retinal_image',
    });

    // 2. Send image to Flask model service for prediction
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), originalname); // Append file stream

    const flaskResponse = await axios.post(`${FLASK_MODEL_SERVICE_URL}/predict`, form, {
      headers: {
        ...form.getHeaders() // Important for multipart/form-data
      }
    });

    const { predictionResult, confidenceScore, message } = flaskResponse.data;

    // 3. Save prediction results to MongoDB
    prediction = await Prediction.create({
      user: req.user._id,
      document: retinalDocument._id, // Link to the uploaded retinal image document
      predictionResult,
      confidenceScore,
    });

    // 4. Update the Document with the prediction ID
    retinalDocument.prediction = prediction._id;
    await retinalDocument.save();

    res.status(200).json({
      message: 'Retinal image uploaded and processed successfully.',
      document: retinalDocument,
      prediction: prediction,
      modelMessage: message, // Message from the Flask service
    });

  } catch (error) {
    console.error('Error during retinal image upload and prediction:', error.message);
    if (error.response) {
      console.error('Flask service response data:', error.response.data);
      console.error('Flask service response status:', error.response.status);
    }

    // Crucially: If something goes wrong, clean up the uploaded file and DB entries
    if (req.file && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting failed upload file:', err);
      });
    }
    // Attempt to clean up document and prediction if they were created before failure
    if (retinalDocument && retinalDocument._id) {
        await Document.findByIdAndDelete(retinalDocument._id);
    }
    if (prediction && prediction._id) {
        await Prediction.findByIdAndDelete(prediction._id);
    }

    // Pass the actual error message from Flask if available, otherwise a generic one
    const errorMessage = error.response ?
                         (error.response.data.error || `Flask service error: ${error.response.status}`) :
                         error.message;

    res.status(500).json({
      message: 'Failed to process retinal image or get prediction.',
      error: errorMessage,
    });
  }
});


/**
 * @desc    Get all documents for the current patient
 * @route   GET /api/patient/documents
 * @access  Private (Patient only)
 */
const getPatientDocuments = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') {
    res.status(403);
    throw new Error('Access denied. Only patients can view their documents.');
  }

  const documents = await Document.find({ user: req.user._id })
                                  .populate('prediction') // Populate prediction details if available
                                  .sort({ uploadDate: -1 }); // Sort by newest first

  res.json(documents);
});


module.exports = {
  getPatientProfile,
  createOrUpdatePatientProfile,
  uploadDocument,
  getPatientDocuments,
  uploadRetinalImage,
};