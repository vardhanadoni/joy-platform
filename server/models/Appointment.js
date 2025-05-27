// // server/models/Appointment.js
// const mongoose = require('mongoose');

// const appointmentSchema = mongoose.Schema({
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User', // Reference to the User model (patient)
//   },
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User', // Reference to the User model (doctor)
//   },
//   appointmentDate: {
//     type: Date,
//     required: true,
//   },
//   appointmentTime: {
//     type: String, // Or you could use Date, but String is simpler for now.  Example: "10:30 AM"
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'], // Possible appointment statuses
//     default: 'confirmed', // For now, we'll auto-confirm
//   },
//   notes: {
//     type: String, // Optional notes from patient or doctor
//   },
// }, {
//   timestamps: true, // Adds createdAt and updatedAt fields
// });

// const Appointment = mongoose.model('Appointment', appointmentSchema);

// module.exports = Appointment;


const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model (patient)
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model (doctor)
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    appointmentTime: {
        type: String, // Example: "10:30 AM"
        required: true,
    },
    status: {
        type: String,
        // Updated enum to include 'cancelled' and 'scheduled' explicitly
        enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
        default: 'scheduled', // Default to 'scheduled' when created
    },
    notes: {
        type: String, // Optional notes from patient or doctor
    },
    // --- NEW FIELDS FOR CANCELLATION ---
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User (patient or doctor) who cancelled
        default: null,
    },
    cancellationReason: {
        type: String,
        trim: true,
        default: null,
    },
    cancellationDate: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
