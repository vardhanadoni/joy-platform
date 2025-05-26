// server/routes/authRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express Router instance
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller functions
const { protect } = require('../middlewares/authMiddleware');
// Define the routes:
// POST request to /api/register will call the registerUser function
router.post('/register', registerUser);

// POST request to /api/login will call the loginUser function
router.post('/login', loginUser);

module.exports = router;