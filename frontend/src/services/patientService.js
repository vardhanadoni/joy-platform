// // client/src/services/patientService.js
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL; // From your client/.env file

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



// client/src/services/patientService.js
import axios from 'axios';

//const API_URL = process.env.REACT_APP_API_URL; // From your client/.env file

let store;
export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
    baseURL: '/' // Base URL for requests, will be proxied by dev server
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is a 401 Unauthorized, and it's not from login/register itself
    if (error.response && error.response.status === 401) {
      // Check if it's specifically a JWT expired error (optional but good for specific messages)
      // You might need to check error.response.data.message for "jwt expired"
      // For now, any 401 will trigger logout.
      console.error('Unauthorized (401) error. Logging out...');
      if (store) {
        store.dispatch(store.getState().auth.logout()); // Dispatch the logout thunk
        // Or if you only have a sync logout reducer:
        // store.dispatch(store.getState().auth.actions.logout()); // Assuming you have a logout action
      }
    }
    return Promise.reject(error); // Re-throw the error so it can be handled by the calling thunk
  }
);

// Function to get patient profile
const getProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.get('/api/profile', config);
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
    };
    // Use backticks for template literal for URL parameters
    const response = await api.get(`/api/doctors/<span class="math-inline">\{doctorId\}/available\-slots?date\=</span>{date}`, config);
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
    const response = await api.put(`/api/profile`, profileData, config);
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
    const response = await api.post(`/api/upload/document`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to upload document.');
  }
};

// Function to get doctors (assuming you have a doctorService or this is patient-specific)
const getDoctors = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get('/api/doctors', config); // API for getting doctors
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
  // The backend route for booking appointments is /api/appointments
  const response = await axios.post('/api/appointments', appointmentData, config);
  return response.data;
};

// Function to upload a retinal image for prediction
const uploadRetinalImage = async (formData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // IMPORTANT for file uploads
      },
    };
    const response = await api.post(`/api/upload/retinal-image`, formData, config);
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
    const response = await api.get(`/api/patient/documents`, config); // This path should match your backend route!
    return response.data;
  } catch (error) {
    console.error('Error fetching patient documents:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch documents.');
  }
};


const getMyAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('/api/appointments/me', config);
    return response.data;
};

const patientService = {
  getProfile,
  updateProfile,
  uploadDocument,
  uploadRetinalImage,
  getPatientDocuments,
  getDoctors, // Make sure to export this if it's new
  bookAppointment, 
  getDoctorAvailableSlots,
  getMyAppointments
};

export default patientService;