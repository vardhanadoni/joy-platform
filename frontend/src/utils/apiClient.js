// // src/utils/apiClient.js
// import axios from 'axios';
// import { store } from '../app/store';
// import { logout } from '../services/authSlice';

// // Use the environment variable directly as the baseURL
// // If REACT_APP_API_URL is 'http://localhost:5005/api', this will be the base.
// const API_URL = process.env.REACT_APP_API_URL;

// const apiClient = axios.create({
//   baseURL: API_URL, // Set the baseURL here
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Check if the error is 401 Unauthorized and it's not a login/register request itself
//     if (error.response && error.response.status === 401 &&
//         !error.config.url.includes('/login') && // Check against relative path now
//         !error.config.url.includes('/register')) { // Check against relative path now
//       console.warn('401 Unauthorized detected. Dispatching logout.');
//       store.dispatch(logout());
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;


// src/utils/apiClient.js
// import axios from 'axios';
// // import { store } from '../app/store'; // REMOVE THIS IMPORT
// // import { logout } from '../services/authSlice'; // This can stay if authSlice doesn't import apiClient

// const API_URL = process.env.REACT_APP_API_URL;
// let storeDispatch = null; // A variable to hold the store's dispatch function
// let logoutAction = null; // A variable to hold the logout action creator

// export const setStoreAndLogoutAction = (dispatch, logoutFn) => {
//   storeDispatch = dispatch;
//   logoutAction = logoutFn;
// };

// const apiClient = axios.create({
//   baseURL: API_URL,
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Check if the error is 401 Unauthorized and it's not a login/register request itself
//     if (error.response && error.response.status === 401 &&
//         !error.config.url.includes('/login') &&
//         !error.config.url.includes('/register')) {
//       console.warn('401 Unauthorized detected. Attempting to dispatch logout.');
//       if (storeDispatch && logoutAction) {
//         storeDispatch(logoutAction()); // Dispatch the logout action
//       } else {
//         console.error('Redux store dispatch or logout action not set in apiClient.');
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;


// src/utils/apiClient.js
// src/utils/apiClient.js
// frontend/src/utils/apiClient.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

let storeDispatch = null;
let logoutAction = null;
// NEW: Variable to hold the actual Redux store object if needed for getState()
let reduxStoreInstance = null; // Declare a variable to hold the store instance

// Modify the setter function to also receive the store instance
export const setStoreAndLogoutAction = (dispatch, logoutFn, storeInstance) => {
  storeDispatch = dispatch;
  logoutAction = logoutFn;
  reduxStoreInstance = storeInstance; // Store the actual store instance
};

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // We must have access to the full store instance to use .getState()
    if (reduxStoreInstance) { // Check if the store instance has been set
      try {
        // CORRECT WAY to get state from the store instance
        const user = reduxStoreInstance.getState().auth.user;
        console.log("apiClient Request Interceptor: User in Redux state:", user);
        if (user && user.token) {
          console.log("apiClient Request Interceptor: Attaching token.");
          config.headers.Authorization = `Bearer ${user.token}`;
        } else {
      console.log("apiClient Request Interceptor: No user or token found, not attaching header."); // ADD THIS
      }
      } catch (error) {
        console.error("Error accessing Redux state in Axios request interceptor:", error);
        // Optionally, you might want to reject the promise here if state access is critical
        // return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 &&
        !error.config.url.includes('/login') &&
        !error.config.url.includes('/register')) {
      console.warn('401 Unauthorized detected. Dispatching logout.');
      if (storeDispatch && logoutAction) {
        storeDispatch(logoutAction());
      } else {
        console.error('Redux store dispatch or logout action not set in apiClient.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;