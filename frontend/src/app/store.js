// // frontend/src/app/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../services/authSlice'; // Adjust path if your authSlice is elsewhere
// import patientReducer from '../services/patientSlice'; // Your patient slice

// export const store = configureStore({
//   reducer: {
//     auth: authReducer, // This will handle all authentication state
//     patient: patientReducer, // This will handle all patient-related state (including doctors and appointments)
//     // Add other reducers here as you create more slices (e.g., doctor: doctorReducer)
//   },
// });


// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from '../services/authSlice'; // Import logout action
import patientReducer from '../services/patientSlice';

import { setStoreAndLogoutAction } from '../utils/apiClient'; // Import the setter function

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

// IMPORTANT: Call this after the store is created to break the circular dependency
setStoreAndLogoutAction(store.dispatch, logout,store);


