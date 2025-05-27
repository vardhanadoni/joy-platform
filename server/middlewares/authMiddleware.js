// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Simple wrapper for async functions to catch errors
const User = require('../models/User'); // Import the User model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., 'Bearer TOKEN')
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the token payload and attach to request object
      // .select('-password') prevents sending the hashed password back
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});

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

// --- NEW: Generic authorizeRoles middleware ---
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401);
      throw new Error('Not authorized, user role not found.');
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role (${req.user.role}) is not authorized to access this resource. Allowed roles: ${roles.join(', ')}`);
    }
    next();
  };
};

// A small utility for handling async errors in Express route handlers
// This replaces wrapping every async handler in a try-catch block

module.exports = { protect, asyncHandler,doctorAuth,
  patientAuth,
  authorizeRoles, };