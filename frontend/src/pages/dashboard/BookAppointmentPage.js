// // client/src/pages/dashboard/BookAppointmentPage.jsx
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


// client/src/pages/dashboard/BookAppointmentPage.jsx
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


// client/src/pages/dashboard/BookAppointmentPage.jsx
// client/src/pages/dashboard/BookAppointmentPage.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  const { doctors, isLoading, isError, message, isSuccess: rawBookingSuccess } = useSelector(
    (state) => state.patient
  );

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [hasBookedSuccessfully, setHasBookedSuccessfully] = useState(false); // NEW STATE FOR CONTROLLED NAVIGATION

  const availableTimeSlots = [
    '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:30', '16:00', '16:30',
    '17:30', '18:00', '18:30', '19:00'
  ];

  // console.log for debugging:
  console.log("Render: rawBookingSuccess =", rawBookingSuccess, " hasBookedSuccessfully =", hasBookedSuccessfully);


  // useLayoutEffect for initial state reset and local state reset (more synchronous)
  useLayoutEffect(() => {
    console.log("BookAppointmentPage useLayoutEffect: Dispatching reset and clearing local flag.");
    dispatch(reset()); // Clear Redux state first thing on mount
    setHasBookedSuccessfully(false); // Ensure local navigation flag is false
  }, [dispatch]); // Only dispatch on mount

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

    if (doctors.length === 0 || (isError && message && message.includes('doctors'))) {
      console.log("BookAppointmentPage: Fetching doctors.");
      dispatch(getDoctors());
    }

    if (isError && message && !message.includes('Authentication token missing.') && !message.includes('doctors')) {
      toast.error(message);
    }

    // Cleanup
    return () => {
      console.log("BookAppointmentPage: Cleanup function running.");
    };
  }, [user, navigate, isError, message, dispatch, doctors.length, authLoading]);


  // Effect 2: Watch for rawBookingSuccess from Redux to SET the local navigation flag
  // This effect's job is ONLY to transfer Redux success state to local component state.
  useEffect(() => {
    if (rawBookingSuccess && !hasBookedSuccessfully) { // Ensure we only set it once
      console.log("BookAppointmentPage: Redux rawBookingSuccess is TRUE. Setting local flag.");
      setHasBookedSuccessfully(true);
    }
  }, [rawBookingSuccess, hasBookedSuccessfully]);


  // Effect 3: Perform navigation based on the local flag
  // This effect's job is ONLY to navigate when the local flag is true.
  useEffect(() => {
    if (hasBookedSuccessfully && !isLoading) { // Ensure isLoading is false before navigating
      console.log("BookAppointmentPage: Local hasBookedSuccessfully is TRUE. Navigating to confirmation.");
      toast.success('Appointment booked successfully!');

      // Reset the local flag IMMEDIATELY before navigating
      setHasBookedSuccessfully(false);

      // Clear local form state (optional here, as it's done on useLayoutEffect too)
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');

      // Perform navigation
      navigate('/appointment-confirmation');

      // IMPORTANT: After navigating, also reset Redux state *again*
      // This ensures the Redux `isSuccess` is false for future re-renders or component mounts
      // This is the safety net that the useLayoutEffect sometimes misses due to sync issues.
      dispatch(reset());
    }
  }, [hasBookedSuccessfully, isLoading, navigate, dispatch]); // Add all dependencies

  const onSubmit = (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select a doctor, date, and time for the appointment.');
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    };

    // Reset local navigation flag when a new booking is initiated
    setHasBookedSuccessfully(false); // Crucial: clear before dispatch
    dispatch(bookAppointment(appointmentData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaCalendarPlus /> Book New Appointment
        </h1>
        <p>Select your preferred doctor, date, and time</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='doctor'>Select Doctor</label>
            <select
              id='doctor'
              name='doctor'
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
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

          <div className='form-group'>
            <label htmlFor='appointmentDate'>Appointment Date</label>
            <input
              type='date'
              id='appointmentDate'
              name='appointmentDate'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='appointmentTime'>Appointment Time</label>
            <select
              id='appointmentTime'
              name='appointmentTime'
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value=''>-- Please choose a time --</option>
              {availableTimeSlots.map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <button className='btn btn-block' type='submit'>
              Book Appointment
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default BookAppointmentPage;