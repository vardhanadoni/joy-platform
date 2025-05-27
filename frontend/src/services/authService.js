// // frontend/src/services/authService.js
// import axios from 'axios';

// // Get API URL from environment variables
// // Make sure your .env file in frontend/ has REACT_APP_API_URL=http://localhost:5000/api
// const API_URL = process.env.REACT_APP_API_URL;

// // Register user
// const register = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     // Backend returns user data and token upon successful registration
//     if (response.data.token) {
//       // The AuthContext's login function will handle localStorage storage after login
//       // For registration, we just return the data to indicate success to the component
//       localStorage.setItem('user', JSON.stringify(response.data));
//       return response.data;
//     }
//     throw new Error('Registration failed: No token received from server.');
//   } catch (error) {
//     console.error('Registration error:', error.response?.data?.message || error.message);
//     // Re-throw error with a user-friendly message
//     throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
//   }
// };

// // Login user
// const login = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, userData);
//     // Backend returns user data and token upon successful login
//     if (response.data.token) {
//       // AuthContext will handle storing the token/user data in localStorage
//       localStorage.setItem('user', JSON.stringify(response.data));
//       return response.data;
//     }
//     throw new Error('Login failed: No token received from server.');
//   } catch (error) {
//     console.error('Login error:', error.response?.data?.message || error.message);
//     // Re-throw error with a user-friendly message
//     throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
//   }
// };

// const logout = () => {
//   localStorage.removeItem('user'); // THIS IS THE KEY PART
//   console.log("User data removed from localStorage."); // For debugging
// };

// // Logout is handled directly by AuthContext (clearing localStorage)
// // No API call is needed for logout unless you have a server-side logout endpoint

// const authService = {
//   register,
//   login,
//   logout,
// };

// export default authService;



// src/services/authService.js
import apiClient from '../utils/apiClient'; // IMPORT apiClient

// Register user
const register = async (userData) => {
  try {
    // Corrected: Removed '/api' prefix
    const response = await apiClient.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    throw new Error('Registration failed: No token received from server.');
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// Login user
const login = async (userData) => {
  try {
    console.log("AuthService: Attempting login with userData:", userData); // ADD THIS
    const response = await apiClient.post('/login', userData);
    console.log("AuthService: Received response:", response); // ADD THIS

    if (response && response.data && response.data.token) { // Add checks for response and response.data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      // If response.data or response.data.token is missing, log more details
      console.error("AuthService: Login response missing data or token:", response);
      throw new Error('Login failed: No token received from server or malformed response.');
    }
  } catch (error) {
    console.error('Login error details:', error); // Log the full error object
    console.error('Login error message:', error.message);
    console.error('Login error response data:', error.response?.data); // Check if response.data exists on error
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};
const logout = () => {
  localStorage.removeItem('user');
  console.log("User data removed from localStorage.");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;