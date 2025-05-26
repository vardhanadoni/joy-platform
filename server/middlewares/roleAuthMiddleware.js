// server/middleware/roleAuthMiddleware.js
const doctorAuth = (req, res, next) => {
  // Assuming `req.user` is populated by the `protect` middleware
  if (req.user && req.user.role === 'doctor') {
    next(); // User is a doctor, proceed to the next middleware/controller
  } else {
    // If not a doctor, send a 403 Forbidden error
    res.status(403);
    throw new Error('Not authorized to access this resource (Doctor role required).');
  }
};

const patientAuth = (req, res, next) => {
  // Assuming `req.user` is populated by the `protect` middleware
  if (req.user && req.user.role === 'patient') {
    next(); // User is a patient, proceed to the next middleware/controller
  } else {
    // If not a patient, send a 403 Forbidden error
    res.status(403);
    throw new Error('Not authorized to access this resource (Patient role required).');
  }
};

module.exports = {
  doctorAuth,
  patientAuth,
};