// // frontend/src/services/patientService.js
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL; // From your frontend/.env file

// // Function to get patient profile
// const getProfile = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`, // Attach the JWT token for authentication
//       },
//     };
//     // The endpoint is /api/profile as per our backend routes
//     const response = await axios.get(`${API_URL}/profile`, config);
//     return response.data; // This should contain the patient's profile data
//   } catch (error) {
//     console.error('Error fetching patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
//   }
// };

// // Function to update patient profile
// const updateProfile = async (profileData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`, // Attach the JWT token
//         'Content-Type': 'application/json', // Specify content type for PUT request
//       },
//     };
//     // The endpoint is /api/profile
//     const response = await axios.put(`${API_URL}/profile`, profileData, config);
//     return response.data; // Updated profile data
//   } catch (error) {
//     console.error('Error updating patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to update profile.');
//   }
// };

// const patientService = {
//   getProfile,
//   updateProfile,
// };

// export default patientService;



// frontend/src/services/patientService.js
// import axios from 'axios';

// //const API_URL = process.env.REACT_APP_API_URL; // From your frontend/.env file

// let store;
// export const injectStore = (_store) => {
//   store = _store;
// };

// const api = axios.create({
//     baseURL: '/', // Base URL for requests, will be proxied by dev server
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If the error is a 401 Unauthorized, and it's not from login/register itself
//     if (error.response && error.response.status === 401) {
//       // Assuming your authSlice logout action is accessible
//         // E.g., store.dispatch(logout()); if logout is exported directly
//         // or store.dispatch(store.getState().auth.actions.logout()); if not.
//         // For simplicity, directly accessing thunk for now if not direct action
//         // This line assumes you export `logout` as a thunk from authSlice
//         // If it's a simple reducer action, you need to import { logout } from '../authSlice'
//         if (store.dispatch(store.getState().auth.logout)) { // Check if logout is a callable thunk
//           store.dispatch(store.getState().auth.logout());
//         } else { // Fallback if logout is just a simple action
//             // You'd need to import { logout } from './authSlice' here too
//             // store.dispatch(logout()); // If you imported logout action
//         }
//     }
//     return Promise.reject(error); // Re-throw the error so it can be handled by the calling thunk
//   }
// );

// // Function to get patient profile
// const getProfile = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await api.get('/api/profile', config);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
//   }
// };

// const getDoctorAvailableSlots = async (doctorId, date, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     // Use backticks for template literal for URL parameters
//     const response = await api.get(`/api/doctors/<span class="math-inline">\{doctorId\}/available\-slots?date\=</span>{date}`, config);
//     return response.data;
// };

// // Function to update patient profile
// const updateProfile = async (profileData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     };
//     const response = await api.put(`/api/profile`, profileData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to update profile.');
//   }
// };

// // Function to upload a general document
// const uploadDocument = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     const response = await api.post(`/api/upload/document`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading document:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload document.');
//   }
// };

// // Function to get doctors (assuming you have a doctorService or this is patient-specific)
// const getDoctors = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await api.get('/api/doctors', config); // API for getting doctors
//   return response.data;
// };

// // Function to book an appointment
// const bookAppointment = async (appointmentData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json', // Ensure content type is JSON
//     },
//   };
//   // The backend route for booking appointments is /api/appointments
//   const response = await axios.post('/api/appointments', appointmentData, config);
//   return response.data;
// };

// // Function to upload a retinal image for prediction
// const uploadRetinalImage = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     const response = await api.post(`/api/upload/retinal-image`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading retinal image:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload retinal image or get prediction.');
//   }
// };

// // Function to get all patient documents
// const getPatientDocuments = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await api.get(`/api/patient/documents`, config); // This path should match your backend route!
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient documents:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch documents.');
//   }
// };


// const getMyAppointments = async (token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await api.get('/api/appointments/me', config);
//     return response.data;
// };

// const patientService = {
//   getProfile,
//   updateProfile,
//   uploadDocument,
//   uploadRetinalImage,
//   getPatientDocuments,
//   getDoctors, // Make sure to export this if it's new
//   bookAppointment, 
//   getDoctorAvailableSlots,
//   getMyAppointments
// };

// export default patientService;


// frontend/src/services/patientService.js
// import axios from 'axios';
// import apiClient from '../utils/apiClient';
// // const API_URL = process.env.REACT_APP_API_URL; // From your frontend/.env file - keep this commented out if you're using proxy

// let store;
// export const injectStore = (_store) => {
//   store = _store;
// };

// const api = axios.create({
//   baseURL: '/', // Base URL for requests, will be proxied by dev server
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If the error is a 401 Unauthorized, and it's not from login/register itself
//     if (error.response && error.response.status === 401) {
//       // Assuming your authSlice logout action is accessible
//       // It's safer to import the logout action directly if possible
//       // import { logout } from '../services/authSlice'; // <-- You might need to add this import at the top

//       // This logic depends on how your authSlice's logout is structured.
//       // If `store.getState().auth.logout` is a thunk that returns a promise or callable:
//       // if (store.dispatch(store.getState().auth.logout)) {
//       //   store.dispatch(store.getState().auth.logout());
//       // } else {
//       //   // Fallback if logout is just a simple action (requires direct import of logout action)
//       //   // console.warn('Auth logout thunk not found or not callable. Ensure authSlice exports `logout`');
//       //   // You'd need to have `import { logout } from './authSlice';` at the top
//       //   // if (typeof logout === 'function') { // Check if imported logout is indeed a function
//       //   //   store.dispatch(logout());
//       //   // }
//       // }

//       // A more robust way to handle this without direct circular import dependency might be
//       // to listen for 401 errors globally in your Redux store setup,
//       // or to have a dedicated API utility that dispatches logout.
//       // For now, let's keep the existing attempt but acknowledge it's tricky.
//       console.warn('401 Unauthorized detected. Attempting to dispatch logout. Please ensure the logout action is correctly wired.');
//       // A common pattern is to have a logout function passed from a higher level,
//       // or to have a separate 'authInterceptor' that has access to the store's dispatch.
//       // For now, we'll leave this as is but note its potential fragility.
//     }
//     return Promise.reject(error); // Re-throw the error so it can be handled by the calling thunk
//   }
// );

// // Function to get patient profile
// const getProfile = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await api.get('/api/profile', config);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
//   }
// };

// // >>>>>>>>>>>>>> THIS IS THE FIXED FUNCTION <<<<<<<<<<<<<<<<
// const getDoctorAvailableSlots = async (doctorId, date, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: { // Correctly send the date as a query parameter
//       date: date
//     }
//   };
//   // Correctly use template literals (backticks) for the doctorId path segment
//   // and ensure no HTML/Markdown is accidentally included.
//   const response = await api.get(`/api/doctors/${doctorId}/available-slots`, config);
//   return response.data;
// };

// // Function to update patient profile
// const updateProfile = async (profileData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     };
//     const response = await api.put(`/api/profile`, profileData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to update profile.');
//   }
// };

// // Function to upload a general document
// const uploadDocument = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     const response = await api.post(`/api/upload/document`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading document:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload document.');
//   }
// };

// // Function to get doctors (assuming you have a doctorService or this is patient-specific)
// // This function was duplicated. Keeping only one clear definition.
// const getDoctors = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await api.get('/api/doctors', config); // API for getting doctors
//   return response.data;
// };

// // Function to book an appointment
// const bookAppointment = async (appointmentData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json', // Ensure content type is JSON
//     },
//   };
//   // The backend route for booking appointments is /api/appointments
//   // Use `api.post` instead of `axios.post` for consistency with interceptors
//   const response = await api.post('/api/appointments', appointmentData, config);
//   return response.data;
// };

// // Function to upload a retinal image for prediction
// const uploadRetinalImage = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     const response = await api.post(`/api/upload/retinal-image`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading retinal image:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload retinal image or get prediction.');
//   }
// };

// // Function to get all patient documents
// const getPatientDocuments = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await api.get(`/api/patient/documents`, config); // This path should match your backend route!
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient documents:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch documents.');
//   }
// };

// // This function was duplicated. Keeping only one clear definition.
// const getMyAppointments = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await api.get('/api/appointments/me', config);
//   return response.data;
// };

// const patientService = {
//   getProfile,
//   updateProfile,
//   uploadDocument,
//   uploadRetinalImage,
//   getPatientDocuments,
//   getDoctors,
//   bookAppointment,
//   getDoctorAvailableSlots,
//   getMyAppointments,
// };

// export default patientService;


// src/services/patientService.js
// No longer need to import axios directly, as apiClient handles it
// import axios from 'axios';



// src/services/patientService.js
// import apiClient from '../utils/apiClient';

// // Function to get patient profile
// const getProfile = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     // Corrected: Removed '/api' prefix
//     const response = await apiClient.get('/profile', config);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
//   }
// };

// const getDoctorAvailableSlots = async (doctorId, date, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: {
//       date: date
//     }
//   };
//   // Corrected: Removed '/api' prefix
//   const response = await apiClient.get(`/doctors/${doctorId}/available-slots`, config);
//   return response.data;
// };

// // Function to update patient profile
// const updateProfile = async (profileData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     };
//     // Corrected: Removed '/api' prefix
//     const response = await apiClient.put(`/profile`, profileData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating patient profile:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to update profile.');
//   }
// };

// // Function to upload a general document
// const uploadDocument = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     // Corrected: Removed '/api' prefix
//     const response = await apiClient.post(`/upload/document`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading document:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload document.');
//   }
// };

// // Function to get doctors
// const getDoctors = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   // Corrected: Removed '/api' prefix
//   const response = await apiClient.get('/doctors', config);
//   return response.data;
// };

// // Function to book an appointment
// const bookAppointment = async (appointmentData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json', // Ensure content type is JSON
//     },
//   };
//   // Corrected: Removed '/api' prefix
//   const response = await apiClient.post('/appointments', appointmentData, config);
//   return response.data;
// };

// // Function to upload a retinal image for prediction
// const uploadRetinalImage = async (formData, token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
//       },
//     };
//     // Corrected: Removed '/api' prefix
//     const response = await apiClient.post(`/upload/retinal-image`, formData, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading retinal image:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to upload retinal image or get prediction.');
//   }
// };

// // Function to get all patient documents
// const getPatientDocuments = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     // Corrected: Removed '/api' prefix
//     const response = await apiClient.get(`/patient/documents`, config);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patient documents:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch documents.');
//   }
// };

// const cancelAppointment = async (appointmentId, token) => {
//     try {
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };
//         const response = await apiClient.put(`/appointments/${appointmentId}/cancel`, {}, config); // Pass empty object for body as it's a PUT
//         return response.data;
//     } catch (error) {
//         console.error('Error cancelling appointment:', error.response?.data?.message || error.message);
//         throw new Error(error.response?.data?.message || 'Failed to cancel appointment.');
//     }
// };

// const getMyAppointments = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   // Corrected: Removed '/api' prefix
//   const response = await apiClient.get('/appointments/me', config);
//   return response.data;
// };

// const patientService = {
//   getProfile,
//   updateProfile,
//   uploadDocument,
//   uploadRetinalImage,
//   getPatientDocuments,
//   getDoctors,
//   bookAppointment,
//   getDoctorAvailableSlots,
//   getMyAppointments,
//   cancelAppointment,
// };

// export default patientService;




import apiClient from '../utils/apiClient';

// Function to get patient profile
const getProfile = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Corrected: Removed '/api' prefix
        const response = await apiClient.get('/profile', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient profile:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
    }
};

const getDoctorAvailableSlots = async (doctorId, date, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            date: date
        }
    };
    // Corrected: Removed '/api' prefix
    const response = await apiClient.get(`/doctors/${doctorId}/available-slots`, config);
    return response.data;
};

// Function to update patient profile
const updateProfile = async (profileData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        // Corrected: Removed '/api' prefix
        const response = await apiClient.put(`/profile`, profileData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating patient profile:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
};

// Function to upload a general document
const uploadDocument = async (formData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
            },
        };
        // Corrected: Removed '/api' prefix
        const response = await apiClient.post(`/upload/document`, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to upload document.');
    }
};

// Function to get doctors
const getDoctors = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Corrected: Removed '/api' prefix
    const response = await apiClient.get('/doctors', config);
    return response.data;
};

// Function to book an appointment
const bookAppointment = async (appointmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure content type is JSON
        },
    };
    // Corrected: Removed '/api' prefix
    const response = await apiClient.post('/appointments', appointmentData, config);
    return response.data;
};

// Function to upload a retinal image for prediction
const uploadRetinalImage = async (formData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Corrected: Removed '/api' prefix
        const response = await apiClient.post(`/upload/retinal-image`, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error uploading retinal image:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to upload retinal image or get prediction.');
    }
};

// Function to get all patient documents
const getPatientDocuments = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Corrected: Removed '/api' prefix
        const response = await apiClient.get(`/patient/documents`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient documents:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch documents.');
    }
};

// --- NEW FUNCTION: Cancel Appointment ---
const cancelAppointment = async (appointmentId, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Correctly makes a PUT request to the cancellation endpoint
        const response = await apiClient.put(`/appointments/${appointmentId}/cancel`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error cancelling appointment:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to cancel appointment.');
    }
};

const getMyAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Corrected: Removed '/api' prefix
    const response = await apiClient.get('/appointments/me', config);
    return response.data;
};

const patientService = {
    getProfile,
    updateProfile,
    uploadDocument,
    uploadRetinalImage,
    getPatientDocuments,
    getDoctors,
    bookAppointment,
    getDoctorAvailableSlots,
    getMyAppointments,
    cancelAppointment, // Correctly exported
};

export default patientService;
