// // server/controllers/doctorController.js
// const User = require('../models/User'); // Assuming doctors are also users

// // @desc    Get all doctors
// // @route   GET /api/doctors
// // @access  Private (accessible by patients)
// const getDoctors = async (req, res) => {
//   try {
//     // Find all users with the role 'doctor'
//     // Select only necessary fields like name and email for patient's view
//     const doctors = await User.find({ role: 'doctor' }).select('name email');

//     if (!doctors || doctors.length === 0) {
//       return res.status(404).json({ message: 'No doctors found at this time.' });
//     }

//     res.status(200).json(doctors);
//   } catch (error) {
//     console.error('Error fetching doctors:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = {
//   getDoctors,
// };



// server/controllers/doctorController.js
const User = require('../models/User'); // Assuming doctors are also users
const asyncHandler = require('express-async-handler'); // For handling async operations gracefully

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private (accessible by patients)
const getDoctors = asyncHandler(async (req, res) => {
  try {
    // Find all users with the role 'doctor'
    // Select only necessary fields like name and email for patient's view
    const doctors = await User.find({ role: 'doctor' }).select('name email');

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found at this time.' });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = {
  getDoctors,
};