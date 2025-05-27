// // frontend/src/pages/dashboard/BookAppointmentPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaCalendarPlus } from 'react-icons/fa'; // Assuming you have react-icons installed
// import Spinner from '../../components/ui/Spinner'; // Adjust path if needed
// import { getDoctors, bookAppointment, reset } from '../../services/patientSlice'; // Corrected path for patientSlice
// import { selectAuth } from '../../services/authSlice'; // Corrected path for authSlice (assuming it's in services)

// function BookAppointmentPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//     const { user, isLoading: authLoading } = useSelector(selectAuth); // Get the logged-in user (patient)
//   const { doctors, isLoading, isError, message, isSuccess: bookingSuccess } = useSelector(
//     (state) => state.patient // Accessing the patient slice state
//   );

//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');

//   // Define available time slots based on our earlier discussion
//   // This can be fetched from the backend in a more complex app, but hardcoding for now.
//   const availableTimeSlots = [
//     '09:30', '10:00', '10:30', '11:00', '11:30', // Morning
//     '13:00', '13:30', '14:00', '14:30',         // Afternoon
//     '15:30', '16:00', '16:30',                   // Mid-Afternoon
//     '17:30', '18:00', '18:30', '19:00'           // Evening
//   ];

//   useEffect(() => {
//     console.log("BookAppointmentPage useEffect mounted!");
//     dispatch(reset());
//      if (authLoading) { // <--- NEW CHECK
//       console.log("BookAppointmentPage: Auth is still loading, waiting...");
//       return;
//     }

//     if (!user) {
//       console.log("BookAppointmentPage: Auth loaded, but user is null. (Would redirect to login, but commented out for testing)");
//       navigate('/login'); // Redirect if not logged in
//       return; // Stop further execution
//     }

//     if (isError) {
//       toast.error(message); // Show error message from backend
//     }

//     // Fetch doctors when the component mounts
//     // Only fetch if doctors array is empty or there was an error fetching
//     if (doctors.length === 0 || isError) {
//       dispatch(getDoctors()); // Token is passed via thunkAPI.getState()
//     }

//     // Reset state after successful booking or on component unmount
//     return () => {
//       // It's good practice to reset on unmount too, but the immediate reset on mount is key here.
//       // If you're navigating away after a success, the `bookingSuccess` useEffect already dispatches reset.
//       // So this cleanup `reset` is primarily for cases where you might leave the page without a success/error
//       // or if you want to ensure a clean state upon return after navigation.
//       // If you just added the reset on mount, you could consider removing this one,
//       // but having both is generally safe for different scenarios.
//       // For now, keep it to see if the issue is resolved.
//       //dispatch(reset()); // Can consider removing this one if the on-mount reset is sufficient
//       console.log("BookAppointmentPage: Cleanup function running.");
//     };
//   }, [user, navigate, isError, message, dispatch, doctors.length, authLoading]); // Add doctors.length to dependency array

//   // Handle successful booking
//   useEffect(() => {
//     if (bookingSuccess) {
//       console.log("BookAppointmentPage: Booking successful, navigating to confirmation.");
//       toast.success('Appointment booked successfully!');
//       navigate('/appointment-confirmation');
//       dispatch(reset()); // Reset Redux patient slice state

//       // ADD THIS: Reset local component state after successful booking
//       setSelectedDoctor('');
//       setSelectedDate('');
//       setSelectedTime('');
//     }
//   }, [bookingSuccess, navigate, dispatch]);


//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !selectedDate || !selectedTime) {
//       toast.error('Please select a doctor, date, and time for the appointment.');
//       return;
//     }

//     const appointmentData = {
//       doctorId: selectedDoctor,
//       appointmentDate: selectedDate,
//       appointmentTime: selectedTime,
//     };

//     dispatch(bookAppointment(appointmentData)); // Token is passed via thunkAPI.getState()
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }

//   return (
//     <>
//       <section className='heading'>
//         <h1>
//           <FaCalendarPlus /> Book New Appointment
//         </h1>
//         <p>Select your preferred doctor, date, and time</p>
//       </section>

//       <section className='form'>
//         <form onSubmit={onSubmit}>
//           <div className='form-group'>
//             <label htmlFor='doctor'>Select Doctor</label>
//             <select
//               id='doctor'
//               name='doctor'
//               value={selectedDoctor}
//               onChange={(e) => setSelectedDoctor(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a doctor --</option>
//               {doctors.length > 0 ? (
//                 doctors.map((doctor) => (
//                   <option key={doctor._id} value={doctor._id}>
//                     Dr. {doctor.name} ({doctor.email})
//                   </option>
//                 ))
//               ) : (
//                 <option value='' disabled>No doctors found</option>
//               )}
//             </select>
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentDate'>Appointment Date</label>
//             <input
//               type='date'
//               id='appointmentDate'
//               name='appointmentDate'
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
//               required
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentTime'>Appointment Time</label>
//             <select
//               id='appointmentTime'
//               name='appointmentTime'
//               value={selectedTime}
//               onChange={(e) => setSelectedTime(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a time --</option>
//               {availableTimeSlots.map((timeSlot) => (
//                 <option key={timeSlot} value={timeSlot}>
//                   {timeSlot}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className='form-group'>
//             <button className='btn btn-block' type='submit'>
//               Book Appointment
//             </button>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// }

// export default BookAppointmentPage;


// frontend/src/pages/dashboard/BookAppointmentPage.jsx
// import React, { useState, useEffect, useRef } from 'react'; // Import useRef
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaCalendarPlus } from 'react-icons/fa';
// import Spinner from '../../components/ui/Spinner';
// import { getDoctors, bookAppointment, reset } from '../../services/patientSlice';
// import { selectAuth } from '../../services/authSlice';

// function BookAppointmentPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user, isLoading: authLoading } = useSelector(selectAuth);
//   const { doctors, isLoading, isError, message, isSuccess: rawBookingSuccess } = useSelector(
//     (state) => state.patient
//   );
//    console.log("BookAppointmentPage: Component rendered. rawBookingSuccess =", rawBookingSuccess); 

//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');

//   const availableTimeSlots = [
//     '09:30', '10:00', '10:30', '11:00', '11:30',
//     '13:00', '13:30', '14:00', '14:30',
//     '15:30', '16:00', '16:30',
//     '17:30', '18:00', '18:30', '19:00'
//   ];

//   // Use a ref to track if the component has just mounted.
//   // This helps prevent effects from running on initial mount if not desired.
//   const isInitialMount = useRef(true);

//   // Effect 1: Initial setup, auth check, and doctor fetching
//   useEffect(() => {
//     console.log("BookAppointmentPage useEffect mounted!");

//     // On initial mount, ensure patient slice state is clean
//     if (isInitialMount.current) {
//         dispatch(reset()); // Clear any lingering success/error states
//         isInitialMount.current = false; // Mark as not initial mount anymore
//     }

//     if (authLoading) {
//       console.log("BookAppointmentPage: Auth is still loading, waiting...");
//       return;
//     }

//     if (!user) {
//       console.log("BookAppointmentPage: Auth loaded, but user is null. Redirecting to login.");
//       navigate('/login');
//       return;
//     }

//     // Only fetch doctors if the list is empty AND there isn't an ongoing error preventing it.
//     // If isError is true, it means the last fetch failed, so try again.
//     if (doctors.length === 0 || (isError && message.includes('Failed to fetch doctors'))) {
//       console.log("BookAppointmentPage: Fetching doctors.");
//       dispatch(getDoctors());
//     }

//     // Handle any general errors (e.g., from getDoctors if not covered above)
//     // Avoid re-toasting the same error if it caused the `isError` to stay true and trigger re-fetch
//     if (isError && !message.includes('Authentication token missing.') && !message.includes('Failed to fetch doctors')) {
//       toast.error(message);
//     }


//     // Cleanup: This runs when the component unmounts
//     // Good for resetting state if you navigate *away* without booking, or if the page is refreshed.
//     return () => {
//       console.log("BookAppointmentPage: Cleanup function running.");
//       // We don't want to reset `isSuccess` here because the `bookingSuccess` useEffect
//       // will handle it and navigate away, thus unmounting this component.
//       // Resetting here could cause a quick flicker of the confirmation page then back to dashboard.
//       // But if you leave the page without booking, you'd want it clean for next time.
//       // Let's keep it minimal, the on-mount reset is usually more critical for this pattern.
//       // dispatch(reset()); // Consider removing this if the on-mount reset is sufficient
//     };
//   }, [user, navigate, isError, message, dispatch, doctors.length, authLoading]);


//   // Effect 2: Handle successful booking
//   useEffect(() => {
//     if (bookingSuccess) {
//       console.log("BookAppointmentPage: Booking successful, preparing to navigate.");
//       toast.success('Appointment booked successfully!');

//       // NEW CHANGE: Reset Redux state *before* navigation
//       // This is crucial to prevent `bookingSuccess` from being true on next mount
//       dispatch(reset()); // Resets isSuccess to false

//       // THEN navigate
//       navigate('/appointment-confirmation');

//       // Clear local form state
//       setSelectedDoctor('');
//       setSelectedDate('');
//       setSelectedTime('');
//     }
//   }, [bookingSuccess, navigate, dispatch]);


//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !selectedDate || !selectedTime) {
//       toast.error('Please select a doctor, date, and time for the appointment.');
//       return;
//     }

//     const appointmentData = {
//       doctorId: selectedDoctor,
//       appointmentDate: selectedDate,
//       appointmentTime: selectedTime,
//     };

//     dispatch(bookAppointment(appointmentData));
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }

//   return (
//     <>
//       <section className='heading'>
//         <h1>
//           <FaCalendarPlus /> Book New Appointment
//         </h1>
//         <p>Select your preferred doctor, date, and time</p>
//       </section>

//       <section className='form'>
//         <form onSubmit={onSubmit}>
//           <div className='form-group'>
//             <label htmlFor='doctor'>Select Doctor</label>
//             <select
//               id='doctor'
//               name='doctor'
//               value={selectedDoctor}
//               onChange={(e) => setSelectedDoctor(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a doctor --</option>
//               {doctors.length > 0 ? (
//                 doctors.map((doctor) => (
//                   <option key={doctor._id} value={doctor._id}>
//                     Dr. {doctor.name} ({doctor.email})
//                   </option>
//                 ))
//               ) : (
//                 <option value='' disabled>No doctors found</option>
//               )}
//             </select>
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentDate'>Appointment Date</label>
//             <input
//               type='date'
//               id='appointmentDate'
//               name='appointmentDate'
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               min={new Date().toISOString().split('T')[0]}
//               required
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentTime'>Appointment Time</label>
//             <select
//               id='appointmentTime'
//               name='appointmentTime'
//               value={selectedTime}
//               onChange={(e) => setSelectedTime(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a time --</option>
//               {availableTimeSlots.map((timeSlot) => (
//                 <option key={timeSlot} value={timeSlot}>
//                   {timeSlot}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className='form-group'>
//             <button className='btn btn-block' type='submit'>
//               Book Appointment
//             </button>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// }

// export default BookAppointmentPage;


// frontend/src/pages/dashboard/BookAppointmentPage.jsx
// frontend/src/pages/dashboard/BookAppointmentPage.jsx
// import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaCalendarPlus } from 'react-icons/fa';
// import Spinner from '../../components/ui/Spinner';
// import { getDoctors, bookAppointment, reset } from '../../services/patientSlice';
// import { selectAuth } from '../../services/authSlice';
// import patientService from '../../services/patientService';

// function BookAppointmentPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user, isLoading: authLoading } = useSelector(selectAuth);
//   const { doctors, isLoading, isError, message, isSuccess: rawBookingSuccess } = useSelector(
//     (state) => state.patient
//   );

//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');

//   const [doctorAvailableSlots, setDoctorAvailableSlots] = useState([]);
//   const [hasBookedSuccessfully, setHasBookedSuccessfully] = useState(false); // NEW STATE FOR CONTROLLED NAVIGATION

//   const availableTimeSlots = [
//     '09:30', '10:00', '10:30', '11:00', '11:30',
//     '13:00', '13:30', '14:00', '14:30',
//     '15:30', '16:00', '16:30',
//     '17:30', '18:00', '18:30', '19:00'
//   ];

//   // console.log for debugging:
//   console.log("Render: rawBookingSuccess =", rawBookingSuccess, " hasBookedSuccessfully =", hasBookedSuccessfully);


//   // useLayoutEffect for initial state reset and local state reset (more synchronous)
//   useLayoutEffect(() => {
//     console.log("BookAppointmentPage useLayoutEffect: Dispatching reset and clearing local flag.");
//     dispatch(reset()); // Clear Redux state first thing on mount
//     setHasBookedSuccessfully(false); // Ensure local navigation flag is false
//   }, [dispatch]); // Only dispatch on mount

//   // Effect 1: Auth check and doctor fetching
//   useEffect(() => {
//     console.log("BookAppointmentPage useEffect mounted!");

//     if (authLoading) {
//       console.log("BookAppointmentPage: Auth is still loading, waiting...");
//       return;
//     }

//     if (!user) {
//       console.log("BookAppointmentPage: Auth loaded, but user is null. Redirecting to login.");
//       navigate('/login');
//       return;
//     }

//     if (doctors.length === 0 || (isError && message && message.includes('doctors'))) {
//       console.log("BookAppointmentPage: Fetching doctors.");
//       dispatch(getDoctors());
//     }

//     if (isError && message && !message.includes('Authentication token missing.') && !message.includes('doctors')) {
//       toast.error(message);
//     }

//     // Cleanup
//     return () => {
//       console.log("BookAppointmentPage: Cleanup function running.");
//     };
//   }, [user, navigate, isError, message, dispatch, doctors.length, authLoading]);


//   // Effect 2: Watch for rawBookingSuccess from Redux to SET the local navigation flag
//   // This effect's job is ONLY to transfer Redux success state to local component state.
//   useEffect(() => {
//     if (rawBookingSuccess && !hasBookedSuccessfully) { // Ensure we only set it once
//       console.log("BookAppointmentPage: Redux rawBookingSuccess is TRUE. Setting local flag.");
//       setHasBookedSuccessfully(true);
//     }
//   }, [rawBookingSuccess, hasBookedSuccessfully]);


//   // Effect 3: Perform navigation based on the local flag
//   // This effect's job is ONLY to navigate when the local flag is true.
//   useEffect(() => {
//     if (hasBookedSuccessfully && !isLoading) { // Ensure isLoading is false before navigating
//       console.log("BookAppointmentPage: Local hasBookedSuccessfully is TRUE. Navigating to confirmation.");
//       toast.success('Appointment booked successfully!');

//       // Reset the local flag IMMEDIATELY before navigating
//       setHasBookedSuccessfully(false);

//       // Clear local form state (optional here, as it's done on useLayoutEffect too)
//       setSelectedDoctor('');
//       setSelectedDate('');
//       setSelectedTime('');

//       // Perform navigation
//       navigate('/appointment-confirmation');

//       // IMPORTANT: After navigating, also reset Redux state *again*
//       // This ensures the Redux `isSuccess` is false for future re-renders or component mounts
//       // This is the safety net that the useLayoutEffect sometimes misses due to sync issues.
//       dispatch(reset());
//     }
//   }, [hasBookedSuccessfully, isLoading, navigate, dispatch]); // Add all dependencies

//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !selectedDate || !selectedTime) {
//       toast.error('Please select a doctor, date, and time for the appointment.');
//       return;
//     }

//     const appointmentData = {
//       doctorId: selectedDoctor,
//       appointmentDate: selectedDate,
//       appointmentTime: selectedTime,
//     };

//     // Reset local navigation flag when a new booking is initiated
//     setHasBookedSuccessfully(false); // Crucial: clear before dispatch
//     dispatch(bookAppointment(appointmentData));
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }

//   return (
//     <>
//       <section className='heading'>
//         <h1>
//           <FaCalendarPlus /> Book New Appointment
//         </h1>
//         <p>Select your preferred doctor, date, and time</p>
//       </section>

//       <section className='form'>
//         <form onSubmit={onSubmit}>
//           <div className='form-group'>
//             <label htmlFor='doctor'>Select Doctor</label>
//             <select
//               id='doctor'
//               name='doctor'
//               value={selectedDoctor}
//               onChange={(e) => setSelectedDoctor(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a doctor --</option>
//               {doctors.length > 0 ? (
//                 doctors.map((doctor) => (
//                   <option key={doctor._id} value={doctor._id}>
//                     Dr. {doctor.name} ({doctor.email})
//                   </option>
//                 ))
//               ) : (
//                 <option value='' disabled>No doctors found</option>
//               )}
//             </select>
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentDate'>Appointment Date</label>
//             <input
//               type='date'
//               id='appointmentDate'
//               name='appointmentDate'
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               min={new Date().toISOString().split('T')[0]}
//               required
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='appointmentTime'>Appointment Time</label>
//             <select
//               id='appointmentTime'
//               name='appointmentTime'
//               value={selectedTime}
//               onChange={(e) => setSelectedTime(e.target.value)}
//               required
//             >
//               <option value=''>-- Please choose a time --</option>
//               {availableTimeSlots.map((timeSlot) => (
//                 <option key={timeSlot} value={timeSlot}>
//                   {timeSlot}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className='form-group'>
//             <button className='btn btn-block' type='submit'>
//               Book Appointment
//             </button>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// }

// export default BookAppointmentPage;


// frontend/src/pages/dashboard/BookAppointmentPage.js
// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaCalendarPlus } from 'react-icons/fa';
// import Spinner from '../../components/ui/Spinner';
// import { getDoctors, bookAppointment, reset } from '../../services/patientSlice';
// import { selectAuth } from '../../services/authSlice';
// import patientService from '../../services/patientService';

// function BookAppointmentPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user, isLoading: authLoading } = useSelector(selectAuth);
//   const {
//     doctors,
//     isLoading,
//     isError,
//     message,
//     isSuccess: bookingSuccessFromRedux
//   } = useSelector((state) => state.patient);

//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');

//   const [doctorAvailableSlots, setDoctorAvailableSlots] = useState([]);
//   const [fetchingSlots, setFetchingSlots] = useState(false);

//   // Use a ref to track if a booking attempt was made
//   const hasAttemptedBooking = React.useRef(false);

//   console.log("Render: bookingSuccessFromRedux =", bookingSuccessFromRedux);


//   // useLayoutEffect for initial state reset and local state reset (more synchronous)
//   // This should always run immediately on mount to clear previous success state.
//   useLayoutEffect(() => {
//     console.log("BookAppointmentPage useLayoutEffect: Dispatching reset.");
//     dispatch(reset()); // Clear Redux state first thing on mount
//     hasAttemptedBooking.current = false; // Ensure no booking attempt is registered initially
//   }, [dispatch]);


//   // Effect 1: Auth check and doctor fetching
//   useEffect(() => {
//     console.log("BookAppointmentPage useEffect mounted!");

//     if (authLoading) {
//       console.log("BookAppointmentPage: Auth is still loading, waiting...");
//       return;
//     }

//     if (!user) {
//       console.log("BookAppointmentPage: Auth loaded, but user is null. Redirecting to login.");
//       navigate('/login');
//       return;
//     }

//     // Only fetch doctors if the list is empty AND not currently loading/errored for doctors
//     if (doctors.length === 0 && !isLoading && !(isError && message && message.includes('doctors'))) {
//       console.log("BookAppointmentPage: Fetching doctors.");
//       dispatch(getDoctors());
//     }

//     // Handle any general errors (e.g., from booking if not caught elsewhere, or other patientSlice errors)
//     if (isError && message && !message.includes('Authentication token missing.')) {
//       toast.error(message);
//     }

//     // Cleanup
//     return () => {
//       console.log("BookAppointmentPage: Cleanup function running.");
//     };
//   }, [user, navigate, isError, message, dispatch, doctors.length, authLoading, isLoading]);


//   // Effect for fetching doctor's available slots
//   useEffect(() => {
//     const fetchDoctorSlots = async () => {
//       if (selectedDoctor && selectedDate && user) {
//         setFetchingSlots(true);
//         try {
//           const token = user.token;
//           const slots = await patientService.getDoctorAvailableSlots(selectedDoctor, selectedDate, token);
//           setDoctorAvailableSlots(slots);
//           if (selectedTime && !slots.includes(selectedTime)) {
//             setSelectedTime('');
//           }
//         } catch (err) {
//           console.error('Error fetching available slots:', err);
//           toast.error(err.response?.data?.message || err.message || 'Failed to fetch available slots.');
//           setDoctorAvailableSlots([]);
//         } finally {
//           setFetchingSlots(false);
//         }
//       } else {
//         setDoctorAvailableSlots([]);
//         setSelectedTime('');
//       }
//     };

//     fetchDoctorSlots();
//   }, [selectedDoctor, selectedDate, user, selectedTime]);


//   // Effect to handle booking success and navigation
//   useEffect(() => {
//     // Only proceed if bookingSuccessFromRedux is TRUE AND we actually attempted a booking
//     if (bookingSuccessFromRedux && hasAttemptedBooking.current) {
//       console.log("BookAppointmentPage: Redux bookingSuccessFromRedux is TRUE and booking was attempted. Navigating.");
//       toast.success('Appointment booked successfully!');

//       // Reset Redux state immediately after consuming success
//       dispatch(reset());

//       // Reset local form state
//       setSelectedDoctor('');
//       setSelectedDate('');
//       setSelectedTime('');
//       hasAttemptedBooking.current = false; // Reset the ref

//       // Navigate to confirmation page
//       navigate('/appointment-confirmation');
//     } else if (bookingSuccessFromRedux && !hasAttemptedBooking.current) {
//         // This log should help identify if rawBookingSuccess is true without an attempt
//         console.warn("BookAppointmentPage: bookingSuccessFromRedux is TRUE but no booking was attempted. Resetting Redux state.");
//         dispatch(reset()); // Force reset if it's true unexpectedly
//     }
//   }, [bookingSuccessFromRedux, dispatch, navigate]);


//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !selectedDate || !selectedTime) {
//       toast.error('Please select a doctor, date, and time for the appointment.');
//       return;
//     }

//     const appointmentData = {
//       doctor: selectedDoctor,
//       appointmentDate: selectedDate,
//       appointmentTime: selectedTime,
//     };

//     console.log("Dispatching bookAppointment with:", appointmentData);
//     hasAttemptedBooking.current = true; // Set ref to true BEFORE dispatching
//     dispatch(bookAppointment(appointmentData));
//   };

//   if (isLoading || fetchingSlots) {
//     return <Spinner />;
//   }

//   return (
//     <div style={styles.container}>
//       <section style={styles.headingSection}>
//         <h1 style={styles.headingTitle}>
//           <FaCalendarPlus style={styles.icon} /> Book New Appointment
//         </h1>
//         <p style={styles.headingSubtitle}>Select your preferred doctor, date, and time</p>
//       </section>

//       <section style={styles.formSection}>
//         <form onSubmit={onSubmit} style={styles.form}>
//           <div style={styles.formGroup}>
//             <label htmlFor='doctor' style={styles.label}>Select Doctor</label>
//             <select
//               id='doctor'
//               name='doctor'
//               value={selectedDoctor}
//               onChange={(e) => {
//                 setSelectedDoctor(e.target.value);
//                 setSelectedTime('');
//               }}
//               style={styles.select}
//               required
//             >
//               <option value=''>-- Please choose a doctor --</option>
//               {doctors.length > 0 ? (
//                 doctors.map((doctor) => (
//                   <option key={doctor._id} value={doctor._id}>
//                     Dr. {doctor.name} ({doctor.email})
//                   </option>
//                 ))
//               ) : (
//                 <option value='' disabled>No doctors found</option>
//               )}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label htmlFor='appointmentDate' style={styles.label}>Appointment Date</label>
//             <input
//               type='date'
//               id='appointmentDate'
//               name='appointmentDate'
//               value={selectedDate}
//               onChange={(e) => {
//                 setSelectedDate(e.target.value);
//                 setSelectedTime('');
//               }}
//               min={new Date().toISOString().split('T')[0]}
//               style={styles.input}
//               required
//             />
//           </div>

//           <div style={styles.formGroup}>
//             <label htmlFor='appointmentTime' style={styles.label}>Appointment Time</label>
//             <select
//               id='appointmentTime'
//               name='appointmentTime'
//               value={selectedTime}
//               onChange={(e) => setSelectedTime(e.target.value)}
//               style={styles.select}
//               required
//               disabled={!selectedDoctor || !selectedDate || doctorAvailableSlots.length === 0 || fetchingSlots}
//             >
//               <option value=''>-- Please choose a time --</option>
//               {selectedDoctor && selectedDate && doctorAvailableSlots.length > 0 ? (
//                 doctorAvailableSlots.map((timeSlot) => (
//                   <option key={timeSlot} value={timeSlot}>
//                     {timeSlot}
//                   </option>
//                 ))
//               ) : (
//                 <option value='' disabled>
//                   {fetchingSlots ? 'Loading available slots...' : (selectedDoctor && selectedDate ? 'No available slots for this date.' : 'Select doctor and date to see available times.')}
//                 </option>
//               )}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <button type='submit' style={styles.submitButton} disabled={isLoading || fetchingSlots}>
//               {isLoading ? 'Booking...' : 'Book Appointment'}
//             </button>
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// }

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarPlus } from 'react-icons/fa';
import Spinner from '../../components/ui/Spinner';
import { getDoctors, bookAppointment, reset } from '../../services/patientSlice';
import { selectAuth } from '../../services/authSlice';
import patientService from '../../services/patientService';

function BookAppointmentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading: authLoading } = useSelector(selectAuth);
  const {
    doctors,
    isLoading,
    isError,
    message,
    isSuccess: bookingSuccessFromRedux
  } = useSelector((state) => state.patient);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [doctorAvailableSlots, setDoctorAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Use a ref to track if a booking attempt was made
  const hasAttemptedBooking = React.useRef(false);

  console.log("Render: bookingSuccessFromRedux =", bookingSuccessFromRedux);


  // useLayoutEffect for initial state reset and local state reset (more synchronous)
  // This should always run immediately on mount to clear previous success state.
  useLayoutEffect(() => {
    console.log("BookAppointmentPage useLayoutEffect: Dispatching reset.");
    dispatch(reset()); // Clear Redux state first thing on mount
    hasAttemptedBooking.current = false; // Ensure no booking attempt is registered initially
  }, [dispatch]);


  // Effect 1: Auth check and doctor fetching
  useEffect(() => {
    console.log("BookAppointmentPage useEffect mounted!");

    if (authLoading) {
      console.log("BookAppointmentPage: Auth is still loading, waiting...");
      return;
    }

    if (!user) {
      console.log("BookAppointmentPage: Auth loaded, but user is null. Redirecting to login.");
      navigate('/login');
      return;
    }

    // Only fetch doctors if the list is empty AND not currently loading/errored for doctors
    if (doctors.length === 0 && !isLoading && !(isError && message && message.includes('doctors'))) {
      console.log("BookAppointmentPage: Fetching doctors.");
      dispatch(getDoctors());
    }

    // Handle any general errors (e.g., from booking if not caught elsewhere, or other patientSlice errors)
    // This will now catch other errors, but the booking error will be handled by onSubmit's specific logic
    if (isError && message && !message.includes('Authentication token missing.')) {
      // Avoid showing this if it's the booking error message, which is handled below
      if (message !== 'Appointment booked successfully!') { // Add a check to avoid showing booking success as an error
        toast.error(message);
      }
    }

    // Cleanup
    return () => {
      console.log("BookAppointmentPage: Cleanup function running.");
    };
  }, [user, navigate, isError, message, dispatch, doctors.length, authLoading, isLoading]);


  // Effect for fetching doctor's available slots
  useEffect(() => {
    const fetchDoctorSlots = async () => {
      if (selectedDoctor && selectedDate && user) {
        setFetchingSlots(true);
        try {
          const token = user.token;
          const slots = await patientService.getDoctorAvailableSlots(selectedDoctor, selectedDate, token);
          setDoctorAvailableSlots(slots);
          if (selectedTime && !slots.includes(selectedTime)) {
            setSelectedTime('');
          }
        } catch (err) {
          console.error('Error fetching available slots:', err);
          // Changed the toast message to directly use the error message from the service
          toast.error(err.message || 'Failed to fetch available slots.');
          setDoctorAvailableSlots([]);
        } finally {
          setFetchingSlots(false);
        }
      } else {
        setDoctorAvailableSlots([]);
        setSelectedTime('');
      }
    };

    fetchDoctorSlots();
  }, [selectedDoctor, selectedDate, user, selectedTime]);


  // Effect to handle booking success and navigation
  useEffect(() => {
    // Only proceed if bookingSuccessFromRedux is TRUE AND we actually attempted a booking
    if (bookingSuccessFromRedux && hasAttemptedBooking.current) {
      console.log("BookAppointmentPage: Redux bookingSuccessFromRedux is TRUE and booking was attempted. Navigating.");
      toast.success('Appointment booked successfully!');

      // Reset Redux state immediately after consuming success
      dispatch(reset());

      // Reset local form state
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      hasAttemptedBooking.current = false; // Reset the ref

      // Navigate to confirmation page
      navigate('/appointment-confirmation');
    } else if (bookingSuccessFromRedux && !hasAttemptedBooking.current) {
        // This log should help identify if rawBookingSuccess is true without an attempt
        console.warn("BookAppointmentPage: bookingSuccessFromRedux is TRUE but no booking was attempted. Resetting Redux state.");
        dispatch(reset()); // Force reset if it's true unexpectedly
    }
  }, [bookingSuccessFromRedux, dispatch, navigate]);


  // IMPORTANT: Modified onSubmit to handle async dispatch and specific error messages
  const onSubmit = async (e) => {
    e.preventDefault();

    // frontend-side validation: Ensures all fields are selected before attempting API call
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select a doctor, date, and time for the appointment.');
      return; // Stop execution if validation fails
    }

    const appointmentData = {
      doctor: selectedDoctor, // Should be doctor's ID
      appointmentDate: selectedDate, // YYYY-MM-DD format
      appointmentTime: selectedTime, // e.g., "09:00 AM" or "14:30"
    };

    console.log("Dispatching bookAppointment with:", appointmentData);
    hasAttemptedBooking.current = true; // Set ref to true BEFORE dispatching

    // Dispatch the async thunk and await its result
    const resultAction = await dispatch(bookAppointment(appointmentData));

    // Check if the thunk was rejected (i.e., API call failed)
    if (bookAppointment.rejected.match(resultAction)) {
      const errorMessage = resultAction.payload; // This payload comes from thunkAPI.rejectWithValue(message)
      toast.error(errorMessage || 'Failed to book appointment. Please try again.'); // Show backend error message
      hasAttemptedBooking.current = false; // Reset ref if booking failed so user can retry
    }
    // Success case is handled by the useEffect watching `bookingSuccessFromRedux`
  };

  if (isLoading || fetchingSlots) {
    return <Spinner />;
  }

  return (
    <div style={styles.container}>
      <section style={styles.headingSection}>
        <h1 style={styles.headingTitle}>
          <FaCalendarPlus style={styles.icon} /> Book New Appointment
        </h1>
        <p style={styles.headingSubtitle}>Select your preferred doctor, date, and time</p>
      </section>

      <section style={styles.formSection}>
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor='doctor' style={styles.label}>Select Doctor</label>
            <select
              id='doctor'
              name='doctor'
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setSelectedTime('');
              }}
              style={styles.select}
              required
            >
              <option value=''>-- Please choose a doctor --</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} ({doctor.email})
                  </option>
                ))
              ) : (
                <option value='' disabled>No doctors found</option>
              )}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor='appointmentDate' style={styles.label}>Appointment Date</label>
            <input
              type='date'
              id='appointmentDate'
              name='appointmentDate'
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
              min={new Date().toISOString().split('T')[0]}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor='appointmentTime' style={styles.label}>Appointment Time</label>
            <select
              id='appointmentTime'
              name='appointmentTime'
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={styles.select}
              required
              disabled={!selectedDoctor || !selectedDate || doctorAvailableSlots.length === 0 || fetchingSlots}
            >
              <option value=''>-- Please choose a time --</option>
              {selectedDoctor && selectedDate && doctorAvailableSlots.length > 0 ? (
                doctorAvailableSlots.map((timeSlot) => (
                  <option key={timeSlot} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))
              ) : (
                <option value='' disabled>
                  {fetchingSlots ? 'Loading available slots...' : (selectedDoctor && selectedDate ? 'No available slots for this date.' : 'Select doctor and date to see available times.')}
                </option>
              )}
            </select>
          </div>

          <div style={styles.formGroup}>
            <button type='submit' style={styles.submitButton} disabled={isLoading || fetchingSlots}>
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

// Inline Styles for the Book Appointment Page
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Arial', sans-serif",
  },
  headingSection: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #eeeeee',
    paddingBottom: '20px',
  },
  headingTitle: {
    fontSize: '2.2rem',
    color: '#007bff',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: '10px',
    color: '#28a745',
    fontSize: '2rem',
  },
  headingSubtitle: {
    fontSize: '1.1rem',
    color: '#555555',
    margin: '0',
  },
  formSection: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333333',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  ':hover': {
    input: {
      borderColor: '#007bff',
    },
    select: {
      borderColor: '#007bff',
    },
    submitButton: {
      backgroundColor: '#218838',
      transform: 'translateY(-2px)',
    },
  },
  ':focus': {
    input: {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
    },
    select: {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
    },
  },
};

export default BookAppointmentPage;