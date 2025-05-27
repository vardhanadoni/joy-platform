// // frontend/src/services/patientSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import patientService from './patientService';

// // Initial state for the patient slice
// const initialState = {
//   doctors: [], // To store the list of doctors fetched for booking
//   appointments: [], // To store the list of appointments
//   isLoading: false, // General loading state for patient slice operations
//   isSuccess: false, // This flag will now PRIMARILY signal success of 'bookAppointment'
//   isError: false, // General error state
//   message: '', // General message (error or success)
// };

// // Async Thunk to Get Doctors
// export const getDoctors = createAsyncThunk(
//   'patient/getDoctors', // Action type prefix
//   async (_, thunkAPI) => {
//     try {
//       const user = thunkAPI.getState().auth.user;
//       if (!user || !user.token) {
//         console.error('No user or token found in Redux state for getDoctors!');
//         return thunkAPI.rejectWithValue('Authentication token missing for doctor fetching.');
//       }
//       const token = user.token;
//       return await patientService.getDoctors(token);
//     } catch (error) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Async Thunk to Book Appointment
// export const bookAppointment = createAsyncThunk(
//   'patient/bookAppointment', // Action type prefix
//   async (appointmentData, thunkAPI) => {
//     try {
//       const user = thunkAPI.getState().auth.user;
//       if (!user || !user.token) {
//         console.error('No user or token found in Redux state for booking appointment!');
//         return thunkAPI.rejectWithValue('Authentication token missing for booking.');
//       }
//       const token = user.token;
//       return await patientService.bookAppointment(appointmentData, token);
//     } catch (error) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Async Thunk to Get My Appointments
// export const getMyAppointments = createAsyncThunk(
//   'patient/getMyAppointments',
//   async (_, thunkAPI) => {
//     try {
//       const user = thunkAPI.getState().auth.user;
//       if (!user || !user.token) {
//         console.error('No user or token found in Redux state for getting appointments!');
//         return thunkAPI.rejectWithValue('Authentication token missing for appointments.');
//       }
//       const token = user.token;
//       return await patientService.getMyAppointments(token);
//     } catch (error) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Async Thunk to Cancel Appointment
// export const cancelAppointment = createAsyncThunk(
//     'patient/cancelAppointment',
//     async (appointmentId, thunkAPI) => {
//         try {
//             const user = thunkAPI.getState().auth.user;
//             if (!user || !user.token) {
//                 return thunkAPI.rejectWithValue('Authentication token missing for cancellation.');
//             }
//             const token = user.token;
//             return await patientService.cancelAppointment(appointmentId, token);
//         } catch (error) {
//             const message =
//                 (error.response && error.response.data && error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const patientSlice = createSlice({
//   name: 'patient',
//   initialState,
//   reducers: {
//     reset: (state) => {
//       // Resets specific states related to async operations (loading, success, error, message)
//       state.isLoading = false;
//       state.isSuccess = false; // Ensure booking success is cleared
//       state.isError = false;
//       state.message = '';
//       state.doctors = []; // Clear doctors
//       state.appointments = []; // Clear appointments
//       // Keep doctors and appointments arrays as they are data, not transient state for an operation.
//       // They should only be cleared on specific actions like logout or fetch errors.
//       // state.doctors = []; // Uncomment if you want to clear doctors on every reset
//       // state.appointments = []; // Uncomment if you want to clear appointments on every reset
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Cases for getDoctors thunk
//       .addCase(getDoctors.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false; // Clear previous errors
//         state.message = '';
//       })
//       .addCase(getDoctors.fulfilled, (state, action) => {
//         state.isLoading = false;
//         // IMPORTANT: DO NOT SET state.isSuccess = true; here.
//         // Success for this thunk is implied by data presence and no error.
//         state.doctors = action.payload; // Store the fetched doctors
//       })
//       .addCase(getDoctors.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         state.doctors = []; // Clear doctors on error
//       })

//       // Cases for bookAppointment thunk
//       .addCase(bookAppointment.pending, (state) => {
//         state.isLoading = true;
//         state.isSuccess = false; // Reset success for this specific operation
//         state.isError = false;
//         state.message = '';
//       })
//       .addCase(bookAppointment.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true; // THIS IS THE ONLY PLACE where isSuccess should become true for booking
//         state.message = action.payload.message || 'Appointment booked successfully!'; // Message from backend upon success
//       })
//       .addCase(bookAppointment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = false; // Ensure success is false on rejection
//         state.isError = true;
//         state.message = action.payload; // Error message from backend
//       })

//       // Cases for getMyAppointments thunk
//       .addCase(getMyAppointments.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false; // Clear previous errors
//         state.message = '';
//       })
//       .addCase(getMyAppointments.fulfilled, (state, action) => {
//         state.isLoading = false;
//         // IMPORTANT: DO NOT SET state.isSuccess = true; here.
//         // Success for this thunk is implied by data presence and no error.
//         state.appointments = action.payload; // Store the fetched appointments
//       })
//       .addCase(getMyAppointments.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         state.appointments = []; // Clear appointments on error
//       })
//       .addCase(cancelAppointment.pending, (state) => {
//                 state.isLoading = true;
//                 state.isError = false;
//                 state.message = '';
//             })
//             .addCase(cancelAppointment.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true; // Or a specific success flag for cancellation
//                 state.message = action.payload.message || 'Appointment cancelled successfully!';
//                 // Update the specific appointment in the appointments array
//                 state.appointments = state.appointments.map((appt) =>
//                     appt._id === action.payload.appointmentId // Assuming backend returns appointmentId
//                         ? { ...appt, status: 'cancelled_by_patient' } // Update status
//                         : appt
//                 );
//             })
//             .addCase(cancelAppointment.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//   },
// });

// export const { reset } = patientSlice.actions; // Export the reset action
// export default patientSlice.reducer;


// frontend/src/services/patientSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from './patientService';

// Initial state for the patient slice
const initialState = {
    doctors: [], // To store the list of doctors fetched for booking
    appointments: [], // To store the list of appointments
    isLoading: false, // General loading state for patient slice operations
    isSuccess: false, // This flag will now PRIMARILY signal success of 'bookAppointment' or 'cancelAppointment'
    isError: false, // General error state
    message: '', // General message (error or success)
};

// Async Thunk to Get Doctors
export const getDoctors = createAsyncThunk(
    'patient/getDoctors', // Action type prefix
    async (_, thunkAPI) => {
        try {
            const user = thunkAPI.getState().auth.user;
            if (!user || !user.token) {
                console.error('No user or token found in Redux state for getDoctors!');
                return thunkAPI.rejectWithValue('Authentication token missing for doctor fetching.');
            }
            const token = user.token;
            return await patientService.getDoctors(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async Thunk to Book Appointment
export const bookAppointment = createAsyncThunk(
    'patient/bookAppointment', // Action type prefix
    async (appointmentData, thunkAPI) => {
        try {
            const user = thunkAPI.getState().auth.user;
            if (!user || !user.token) {
                console.error('No user or token found in Redux state for booking appointment!');
                return thunkAPI.rejectWithValue('Authentication token missing for booking.');
            }
            const token = user.token;
            return await patientService.bookAppointment(appointmentData, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async Thunk to Get My Appointments
export const getMyAppointments = createAsyncThunk(
    'patient/getMyAppointments',
    async (_, thunkAPI) => {
        try {
            const user = thunkAPI.getState().auth.user;
            if (!user || !user.token) {
                console.error('No user or token found in Redux state for getting appointments!');
                return thunkAPI.rejectWithValue('Authentication token missing for appointments.');
            }
            const token = user.token;
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

// Async Thunk to Cancel Appointment (Already present in your code)
export const cancelAppointment = createAsyncThunk(
    'patient/cancelAppointment',
    async (appointmentId, thunkAPI) => {
        try {
            const user = thunkAPI.getState().auth.user;
            if (!user || !user.token) {
                return thunkAPI.rejectWithValue('Authentication token missing for cancellation.');
            }
            const token = user.token;
            return await patientService.cancelAppointment(appointmentId, token);
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
            state.isLoading = false;
            state.isSuccess = false; // Ensure booking success is cleared
            state.isError = false;
            state.message = '';
            // Note: We typically don't clear doctors/appointments on a general reset
            // unless it's a full logout. They are data, not transient operation flags.
            // state.doctors = [];
            // state.appointments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Cases for getDoctors thunk
            .addCase(getDoctors.pending, (state) => {
                state.isLoading = true;
                state.isError = false; // Clear previous errors
                state.message = '';
            })
            .addCase(getDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                // IMPORTANT: DO NOT SET state.isSuccess = true; here.
                // Success for this thunk is implied by data presence and no error.
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
                state.isSuccess = false; // Reset success for this specific operation
                state.isError = false;
                state.message = '';
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true; // THIS IS THE ONLY PLACE where isSuccess should become true for booking
                state.message = action.payload.message || 'Appointment booked successfully!'; // Message from backend upon success
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false; // Ensure success is false on rejection
                state.isError = true;
                state.message = action.payload; // Error message from backend
            })

            // Cases for getMyAppointments thunk
            .addCase(getMyAppointments.pending, (state) => {
                state.isLoading = true;
                state.isError = false; // Clear previous errors
                state.message = '';
            })
            .addCase(getMyAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                // IMPORTANT: DO NOT SET state.isSuccess = true; here.
                // Success for this thunk is implied by data presence and no error.
                state.appointments = action.payload; // Store the fetched appointments
            })
            .addCase(getMyAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.appointments = []; // Clear appointments on error
            })

            // Cases for cancelAppointment thunk (already present in your code)
            .addCase(cancelAppointment.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true; // Signal success for cancellation
                state.message = action.payload.message || 'Appointment cancelled successfully!';
                // Update the specific appointment in the appointments array
                state.appointments = state.appointments.map((appt) =>
                    appt._id === action.payload.appointmentId
                        // Use action.payload.newStatus for consistency with backend response
                        ? { ...appt, status: action.payload.newStatus }
                        : appt
                );
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = patientSlice.actions; // Export the reset action
export default patientSlice.reducer;
