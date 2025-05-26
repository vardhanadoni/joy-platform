// // server/routes/patientRoutes.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path'); // Node.js built-in path module

// // Import controller functions
// const {
//   getPatientProfile,
//   createOrUpdatePatientProfile,
//   uploadDocument,
//   getPatientDocuments,
//   uploadRetinalImage,
// } = require('../controllers/patientController');

// // Import authentication middleware
// const { protect } = require('../middleware/authMiddleware');

// // --- Multer Storage Configuration for General Documents ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Define the upload directory. Make sure 'server/uploads' exists!
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename: fieldname-timestamp.ext
//     // Example: document-16789012345.jpg
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// // Filter to allow only specific file types (e.g., images, PDFs)
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/; // Regex for allowed extensions
//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedFileTypes.test(file.mimetype); // Check MIME type

//   if (extname && mimetype) {
//     return cb(null, true); // Accept file
//   } else {
//     cb(new Error('Invalid file type. Only JPG, PNG, PDF, DOC, DOCX files are allowed!'), false); // Reject file
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
// });

// // --- Patient Profile Routes ---
// // GET /api/patient/profile - Get current patient's profile
// // PUT /api/patient/profile - Create or update current patient's profile
// router
//   .route('/patient/profile')
//   .get(protect, getPatientProfile)
//   .put(protect, createOrUpdatePatientProfile); // Using PUT for upsert (create or update)

// // --- General Document Upload & Get Routes ---
// // POST /api/upload/document - Upload a general document
// // 'single('documentFile')' means it expects a single file upload named 'documentFile'
// router.post('/upload/document', protect, upload.single('documentFile'), uploadDocument);

// // GET /api/patient/documents - Get all documents for the current patient
// router.get('/patient/documents', protect, getPatientDocuments);


// module.exports = router;




// server/routes/patientRoutes.js
// server/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import controller functions
const {
  getPatientProfile,
  createOrUpdatePatientProfile,
  uploadDocument,
  getPatientDocuments,
  uploadRetinalImage,
} = require('../controllers/PatientController');

// Import authentication middleware
const { protect } = require('../middlewares/authMiddleware');

// --- Multer Storage Configuration for ALL Documents (including retinal images) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, DOC, DOCX files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});


// --- Patient Profile Routes ---
// CHANGED PATH FROM '/patient/profile' TO '/profile' TO MATCH FRONTEND
router
  .route('/profile') // <--- THIS LINE HAS BEEN UPDATED!
  .get(protect, getPatientProfile)
  .put(protect, createOrUpdatePatientProfile);

// --- General Document Upload & Get Routes ---
router.post('/upload/document', protect, upload.single('documentFile'), uploadDocument);
router.get('/patient/documents', protect, getPatientDocuments);

// --- Retinal Image Upload Route ---
router.post('/upload/retinal-image', protect, upload.single('retinalImage'), uploadRetinalImage);


module.exports = router;