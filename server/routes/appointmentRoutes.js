// server/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { bookAppointment,getMyAppointments,getDoctorAvailableSlots  } = require('../controllers/appointmentController'); // Will create this next
const { protect,authorizeRoles } = require('../middlewares/authMiddleware'); // To ensure user is logged in
const { patientAuth } = require('../middlewares/roleAuthMiddleware'); // To ensure only patients can book

// Route to book a new appointment
// This route should be accessible only by authenticated patients
router.post('/', protect, authorizeRoles('patient'), bookAppointment);
router.get('/me', protect, authorizeRoles('patient'), getMyAppointments);
// We might add routes for viewing appointments, cancelling, etc. later
router.get('/:doctorId/available-slots', protect, authorizeRoles('patient'), getDoctorAvailableSlots);


module.exports = router;