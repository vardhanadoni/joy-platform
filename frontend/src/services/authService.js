// client/src/services/authService.js
import axios from 'axios';

// Get API URL from environment variables
// Make sure your .env file in client/ has REACT_APP_API_URL=http://localhost:5000/api
const API_URL = process.env.REACT_APP_API_URL;

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    // Backend returns user data and token upon successful registration
    if (response.data.token) {
      // The AuthContext's login function will handle localStorage storage after login
      // For registration, we just return the data to indicate success to the component
      return response.data;
    }
    throw new Error('Registration failed: No token received from server.');
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    // Re-throw error with a user-friendly message
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    // Backend returns user data and token upon successful login
    if (response.data.token) {
      // AuthContext will handle storing the token/user data in localStorage
      return response.data;
    }
    throw new Error('Login failed: No token received from server.');
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    // Re-throw error with a user-friendly message
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Logout is handled directly by AuthContext (clearing localStorage)
// No API call is needed for logout unless you have a server-side logout endpoint

const authService = {
  register,
  login,
};

export default authService;