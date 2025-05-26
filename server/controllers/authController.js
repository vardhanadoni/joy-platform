// server/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 hour
  });
};
/**
 * @desc    Register a new user
 * @route   POST /api/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Basic Validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please enter all required fields: name, email, password, and role.');
  }

  // 2. Validate Role
  if (!['patient', 'doctor'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified. Role must be "patient" or "doctor".');
  }

  // 3. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User with that email already exists.');
  }

  // 4. Create User
  const user = await User.create({
    name,
    email,
    password, // Password hashing happens via Mongoose pre-save middleware
    role,
  });

  // 5. Respond with Token and User Data
  if (user) {
    res.status(201).json({ // 201 Created
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided.');
  }
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter both email and password.');
  }

  // 2. Check for user by email
  const user = await User.findOne({ email });

  // 3. Check password using the custom method defined in User model
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password.');
  }
});


module.exports = {
  registerUser,
  loginUser,
};