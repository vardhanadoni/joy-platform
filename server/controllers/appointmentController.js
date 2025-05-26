// // server/controllers/appointmentController.js
// const asyncHandler = require('express-async-handler');
// const Appointment = require('../models/Appointment');
// const User = require('../models/User'); // To find doctor's email
// const sendEmail = require('../utils/sendEmail'); // Our email utility

// // @desc    Book a new appointment
// // @route   POST /api/appointments
// // @access  Private/Patient
// const bookAppointment = asyncHandler(async (req, res) => {
//   const { doctorId, appointmentDate, appointmentTime } = req.body;

//   // 1. Basic Validation
//   if (!doctorId || !appointmentDate || !appointmentTime) {
//     res.status(400);
//     throw new Error('Please provide doctor, date, and time for the appointment.');
//   }

//   // Ensure the current user is a patient (though roleAuthMiddleware already does this)
//   if (req.user.role !== 'patient') {
//     res.status(403);
//     throw new Error('Only patients can book appointments.');
//   }

//   // 2. Validate Doctor Existence and Role
//   const doctor = await User.findById(doctorId);
//   if (!doctor || doctor.role !== 'doctor') {
//     res.status(404);
//     throw new Error('Selected doctor not found or is not a doctor account.');
//   }

//   // 3. Validate Appointment Date/Time
//   const requestedDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
//   if (isNaN(requestedDateTime.getTime())) {
//       res.status(400);
//       throw new Error('Invalid date or time format provided.');
//   }
//   if (requestedDateTime < new Date()) {
//       res.status(400);
//       throw new Error('Cannot book an appointment in the past.');
//   }

//   // Optional: Add more sophisticated validation for specific time slots later if needed.
//   // For example, ensuring appointmentTime matches one of the defined half-hourly slots.

//   // 4. Create the Appointment
//   const appointment = await Appointment.create({
//     patient: req.user._id, // The logged-in patient's ID
//     doctor: doctorId,
//     appointmentDate: new Date(appointmentDate), // Store as Date object
//     appointmentTime,
//     status: 'confirmed', // Default to confirmed as per our discussion
//     notes: `Appointment with Dr. ${doctor.name} for Patient ${req.user.name}.`
//   });

//   // 5. Send Email Notifications
//   try {
//     // Email to Patient
//     const patientEmailSubject = `Appointment Confirmed: Dr. ${doctor.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}`;
//     const patientEmailHtml = `
//       <h1>Appointment Confirmation</h1>
//       <p>Dear ${req.user.name},</p>
//       <p>Your appointment with Dr. ${doctor.name} has been successfully confirmed!</p>
//       <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
//       <p><strong>Time:</strong> ${appointmentTime}</p>
//       <p>We look forward to seeing you. Please log in to the app to view more details.</p>
//       <p>Best regards,<br>The Diabetic Retinopathy App Team</p>
//     `;
//     await sendEmail({
//       to: req.user.email,
//       subject: patientEmailSubject,
//       html: patientEmailHtml,
//       text: `Your appointment with Dr. ${doctor.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime} is confirmed. Please log in to the app for details.`
//     });

//     // Email to Doctor
//     const doctorEmailSubject = `New Appointment from ${req.user.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}`;
//     const doctorEmailHtml = `
//       <h1>New Appointment Notification</h1>
//       <p>Dear Dr. ${doctor.name},</p>
//       <p>You have a new appointment from patient ${req.user.name}.</p>
//       <p><strong>Patient Name:</strong> ${req.user.name}</p>
//       <p><strong>Patient Email:</strong> ${req.user.email}</p>
//       <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
//       <p><strong>Time:</strong> ${appointmentTime}</p>
//       <p>This appointment has been automatically confirmed. Please log in to your dashboard to view full patient details and manage your schedule.</p>
//       <p>Best regards,<br>The Diabetic Retinopathy App Team</p>
//     `;
//     await sendEmail({
//       to: doctor.email,
//       subject: doctorEmailSubject,
//       html: doctorEmailHtml,
//       text: `New appointment from ${req.user.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}. Log in to your dashboard for details.`
//     });

//   } catch (emailError) {
//     console.error('Failed to send appointment confirmation emails:', emailError);
//     // Important: Even if email fails, the appointment is still created.
//     // You might want to log this error, notify an admin, or use a retry mechanism.
//   }

//   res.status(201).json({
//     message: 'Appointment booked successfully and emails sent.',
//     appointmentId: appointment._id,
//     status: appointment.status,
//   });
// });

// module.exports = {
//   bookAppointment,
// };



const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // To find doctor's email
const sendEmail = require('../utils/sendEmail'); // Our email utility

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, appointmentTime } = req.body;

  // 1. Basic Validation
  if (!doctorId || !appointmentDate || !appointmentTime) {
    res.status(400);
    throw new Error('Please provide doctor, date, and time for the appointment.');
  }

  // Ensure the current user is a patient (though roleAuthMiddleware already does this)
  if (req.user.role !== 'patient') {
    res.status(403);
    throw new Error('Only patients can book appointments.');
  }

  // 2. Validate Doctor Existence and Role
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') {
    res.status(404);
    throw new Error('Selected doctor not found or is not a doctor account.');
  }

  // 3. Validate Appointment Date/Time
  const requestedDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
  if (isNaN(requestedDateTime.getTime())) {
    res.status(400);
    throw new Error('Invalid date or time format provided.');
  }
  if (requestedDateTime < new Date()) {
    res.status(400);
    throw new Error('Cannot book an appointment in the past.');
  }

  // --- START CHANGES FOR ISSUE 1: Check for existing appointment ---
  // 4. Check for existing appointment for the same doctor and slot
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate), // Ensure date format matches storage
    appointmentTime: appointmentTime,
    status: { $ne: 'cancelled' } // Don't block if a previous appointment was cancelled
  });

  if (existingAppointment) {
    res.status(409); // Conflict
    throw new Error('This time slot is already booked for the selected doctor. Please choose another slot.');
  }
  // --- END CHANGES FOR ISSUE 1 ---

  // 5. Create the Appointment (now step 5, was 4)
  const appointment = await Appointment.create({
    patient: req.user._id, // The logged-in patient's ID
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate), // Store as Date object
    appointmentTime,
    status: 'confirmed', // Default to confirmed as per our discussion
    notes: `Appointment with Dr. ${doctor.name} for Patient ${req.user.name}.`
  });

  // 6. Send Email Notifications (now step 6, was 5)
  try {
    // Email to Patient
    const patientEmailSubject = `Appointment Confirmed: Dr. ${doctor.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}`;
    const patientEmailHtml = `
      <h1>Appointment Confirmation</h1>
      <p>Dear ${req.user.name},</p>
      <p>Your appointment with Dr. ${doctor.name} has been successfully confirmed!</p>
      <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
      <p><strong>Time:</strong> ${appointmentTime}</p>
      <p>We look forward to seeing you. Please log in to the app to view more details.</p>
      <p>Best regards,<br>The Diabetic Retinopathy App Team</p>
    `;
    console.log('Attempting to send patient email to:', req.user.email); // Debugging log
    await sendEmail({
      to: req.user.email,
      subject: patientEmailSubject,
      html: patientEmailHtml,
      text: `Your appointment with Dr. ${doctor.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime} is confirmed. Please log in to the app for details.`
    });

    // Email to Doctor
    const doctorEmailSubject = `New Appointment from ${req.user.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}`;
    const doctorEmailHtml = `
      <h1>New Appointment Notification</h1>
      <p>Dear Dr. ${doctor.name},</p>
      <p>You have a new appointment from patient ${req.user.name}.</p>
      <p><strong>Patient Name:</strong> ${req.user.name}</p>
      <p><strong>Patient Email:</strong> ${req.user.email}</p>
      <p><strong>Date:</strong> ${new Date(appointmentDate).toDateString()}</p>
      <p><strong>Time:</strong> ${appointmentTime}</p>
      <p>This appointment has been automatically confirmed. Please log in to your dashboard to view full patient details and manage your schedule.</p>
      <p>Best regards,<br>The Diabetic Retinopathy App Team</p>
    `;
    console.log('Attempting to send doctor email to:', doctor.email); // Debugging log
    await sendEmail({
      to: doctor.email,
      subject: doctorEmailSubject,
      html: doctorEmailHtml,
      text: `New appointment from ${req.user.name} on ${new Date(appointmentDate).toDateString()} at ${appointmentTime}. Log in to your dashboard for details.`
    });

  } catch (emailError) {
    console.error('Failed to send appointment confirmation emails:', emailError);
    // Important: Even if email fails, the appointment is still created.
    // You might want to log this error, notify an admin, or use a retry mechanism.
  }

  res.status(201).json({
    message: 'Appointment booked successfully and emails sent.',
    appointmentId: appointment._id,
    status: appointment.status,
  });
});


// --- START NEW FUNCTION FOR ISSUE 1: Get doctor's available slots ---
// @desc    Get doctor's available time slots for a given date
// @route   GET /api/doctors/:doctorId/available-slots?date=YYYY-MM-DD
// @access  Private/Patient
const getDoctorAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!doctorId || !date) {
    res.status(400);
    throw new Error('Doctor ID and date are required.');
  }

  // Validate date format (simple check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400);
    throw new Error('Invalid date format. Use YYYY-MM-DD.');
  }

  const queryDate = new Date(date);
  // Normalize queryDate to start of day for comparison
  queryDate.setUTCHours(0, 0, 0, 0);

  if (isNaN(queryDate.getTime())) {
    res.status(400);
    throw new Error('Invalid date provided.');
  }

  // Find all confirmed/pending appointments for this doctor on this date
  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    // Match only the date part, ignoring time
    appointmentDate: {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) // Next day
    },
    status: { $ne: 'cancelled' } // Exclude cancelled appointments
  }).select('appointmentTime'); // Only fetch the time

  const bookedTimes = new Set(bookedAppointments.map(app => app.appointmentTime));

  // The fixed list of all possible slots for a doctor's workday
  const allPossibleSlots = [
    '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:30', '16:00', '16:30',
    '17:30', '18:00', '18:30', '19:00'
  ];

  // Filter out booked times
  let availableSlots = allPossibleSlots.filter(slot => !bookedTimes.has(slot));

  // Filter out past slots for TODAY'S date only
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  todayStart.setUTCHours(0, 0, 0, 0); // Normalize to start of today in UTC

  if (queryDate.getTime() === todayStart.getTime()) { // If the requested date is today
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    availableSlots = availableSlots.filter(slot => {
      const [slotHourStr, slotMinuteStr] = slot.split(':');
      const slotHour = parseInt(slotHourStr);
      const slotMinute = parseInt(slotMinuteStr);

      // Convert current time to minutes for easy comparison
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const slotTimeInMinutes = slotHour * 60 + slotMinute;

      return slotTimeInMinutes > currentTimeInMinutes;
    });
  }

  res.status(200).json(availableSlots);
});
// --- END NEW FUNCTION FOR ISSUE 1 ---


// --- START NEW FUNCTION FOR ISSUE 2: Get patient's appointments ---
// @desc    Get patient's appointments
// @route   GET /api/appointments/me
// @access  Private/Patient
const getMyAppointments = asyncHandler(async (req, res) => {
    // Find appointments where the patient field matches the logged-in user's ID
    // Populate doctor details to display doctor's name, email, etc.
    const appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name email') // Fetch doctor's name and email
        .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sort by date and time

    res.status(200).json(appointments);
});
// --- END NEW FUNCTION FOR ISSUE 2 ---


module.exports = {
  bookAppointment,
  getDoctorAvailableSlots, // Export the new function for available slots
  getMyAppointments, // Export the new function for patient's appointments
};