// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique for each user
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'], // Restrict roles to 'patient' or 'doctor'
      default: 'patient', // Default role if not specified
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// --- Mongoose Middleware for Password Hashing ---
// This will run before saving a user document
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next(); // Move to the next middleware or save operation
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // 10 rounds of hashing
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Method to Compare Passwords ---
// This method will be available on user instances
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;