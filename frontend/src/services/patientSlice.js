// client/src/services/patientSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from './patientService';

// Initial state for the patient slice
const initialState = {
  // ... (your existing patient-related states, if any, e.g., patientProfile: null)
  doctors: [], // To store the list of doctors fetched for booking
  appointments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async Thunk to Get Doctors
export const getDoctors = createAsyncThunk(
  'patient/getDoctors', // Action type prefix
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user; // Get the whole user object
      if (!user || !user.token) {
        console.error('No user or token found in Redux state for getDoctors!');
        return thunkAPI.rejectWithValue('Authentication token missing.');
      }
      const token = user.token;
      console.log('Fetching doctors with token:', token); // Log the token
      return await patientService.getDoctors(token);
    }  catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message); // Pass error message
    }
  }
);

// Async Thunk to Book Appointment
export const bookAppointment = createAsyncThunk(
  'patient/bookAppointment', // Action type prefix
  async (appointmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token; // Get token from auth state
      return await patientService.bookAppointment(appointmentData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message); // Pass error message
    }
  }
);

export const getMyAppointments = createAsyncThunk(
  'patient/getMyAppointments',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await patientService.getMyAppointments(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    reset: (state) => {
      // Resets specific states related to async operations (loading, success, error, message)
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      // Keep doctors array as it's data, not a transient state for an operation
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for getDoctors thunk
      .addCase(getDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctors = action.payload; // Store the fetched doctors
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.doctors = []; // Clear doctors on error
      })
      // Cases for bookAppointment thunk
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; // Message from backend upon success
        // If you were tracking patient's appointments in state, you'd add the new one here.
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Error message from backend
      })
      .addCase(getMyAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; // Use a separate success flag if preferred, or rely on data presence
        state.appointments = action.payload; // Store the fetched appointments
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.appointments = []; // Clear appointments on error
      });
  },
});

export const { reset } = patientSlice.actions; // Export the reset action
export default patientSlice.reducer;