// // server/routes/doctorRoutes.js
// const express = require('express');
// const router = express.Router();
// const { getDoctors } = require('../controllers/doctorController');
// const { protect } = require('../middlewares/authMiddleware'); // For protecting routes

// // Route to get all doctors (accessible by authenticated users, e.g., patients)
// router.get('/', protect, getDoctors);

// module.exports = router;


// server/routes/doctorRoutes.js (or create a new appointmentRoutes.js)
const express = require('express');
const router = express.Router();
const { getDoctors } = require('../controllers/doctorController'); // Assuming you have this
const { getDoctorAvailableSlots } = require('../controllers/appointmentController'); // Import the new controller function
const { protect, authorizeRoles } = require('../middlewares/authMiddleware'); // Your auth middleware

// Route to get all doctors (already exists probably)
router.get('/', protect, authorizeRoles('patient', 'admin'), getDoctors); // Ensure 'patient' can access this

// New route for available slots
router.get('/:doctorId/available-slots', protect, authorizeRoles('patient'), getDoctorAvailableSlots);

module.exports = router;