// // frontend/src/pages/dashboard/MyAppointmentsPage.js
// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import { getMyAppointments,cancelAppointment, reset} from '../../services/patientSlice'; // Assuming this thunk fetches all patient appointments
// import Spinner from '../../components/ui/Spinner';

// const MyAppointmentsPage = () => {
//     const dispatch = useDispatch();
//     const { appointments, isLoading, isError, message,isSuccess  } = useSelector(
//         (state) => state.patient
//     );

//     useEffect(() => {
//         // Fetch appointments when the component mounts
//         dispatch(getMyAppointments());

//         if (isError) {
//             toast.error(message);
//         }
//     }, [dispatch, isError, message]);

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     if (isLoading) {
//         return <Spinner />;
//     }

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.heading}>Your Appointments</h1>
//             {appointments.length === 0 ? (
//                 <p style={styles.noAppointments}>You have no appointments yet. <a href="/book-appointment">Book one now!</a></p>
//             ) : (
//                 <div style={styles.appointmentsGrid}>
//                     {appointments.map((appointment) => (
//                         <div key={appointment._id} style={styles.appointmentCard}>
//                             <h3>Dr. {appointment.doctor?.name || 'N/A'}</h3>
//                             <p><strong>Email:</strong> {appointment.doctor?.email || 'N/A'}</p>
//                             <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
//                             <p><strong>Time:</strong> {appointment.appointmentTime}</p>
//                             <p><strong>Status:</strong> <span style={{ color: appointment.status === 'confirmed' ? 'green' : 'orange', fontWeight: 'bold' }}>{appointment.status}</span></p>
//                             {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
//                             {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
//                             {/* Add more details as needed */}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// const styles = {
//     container: {
//         maxWidth: '900px',
//         margin: '30px auto',
//         padding: '20px',
//         backgroundColor: '#f9f9f9',
//         borderRadius: '10px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
//     },
//     heading: {
//         textAlign: 'center',
//         color: '#2c3e50',
//         marginBottom: '30px',
//         fontSize: '30px',
//         fontWeight: '600',
//     },
//     noAppointments: {
//         textAlign: 'center',
//         fontSize: '18px',
//         color: '#666',
//         padding: '20px',
//         border: '1px dashed #ccc',
//         borderRadius: '8px',
//         backgroundColor: '#fff',
//     },
//     appointmentsGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//         gap: '20px',
//     },
//     appointmentCard: {
//         backgroundColor: 'white',
//         border: '1px solid #e0e0e0',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//         transition: 'transform 0.2s ease-in-out',
//     },
// };

// export default MyAppointmentsPage;

// frontend/src/pages/dashboard/MyAppointmentsPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// Import the new cancelAppointment thunk
import { getMyAppointments, cancelAppointment, reset } from '../../services/patientSlice';
import Spinner from '../../components/ui/Spinner';

const MyAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading, isError, message, isSuccess } = useSelector(
        (state) => state.patient
    );

    // Effect to fetch appointments and handle general slice state (errors/success)
    useEffect(() => {
        // Fetch appointments when the component mounts
        dispatch(getMyAppointments());

        // Handle errors from any patientSlice action (get, book, cancel)
        if (isError) {
            toast.error(message);
            // Consider dispatching reset() here if you want to clear error state immediately
            // dispatch(reset());
        }

        // Handle success from actions like cancellation
        // Only show toast if isSuccess is true AND there's a specific message (e.g., from cancelAppointment.fulfilled)
        if (isSuccess && message) {
            toast.success(message);
            // Reset the success state after showing the toast to prevent it from showing again on re-render
            dispatch(reset());
        }

    }, [dispatch, isError, message, isSuccess]); // Added isSuccess to dependencies

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- NEW: handleCancel function ---
    const handleCancel = (appointmentId) => {
        // Use a custom confirmation dialog instead of window.confirm for better UX
        // For simplicity, I'll keep window.confirm for now, but recommend a modal
        if (window.confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
            dispatch(cancelAppointment(appointmentId));
        }
    };


    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Your Appointments</h1>
            {appointments.length === 0 ? (
                <p style={styles.noAppointments}>You have no appointments yet. <a href="/book-appointment">Book one now!</a></p>
            ) : (
                <div style={styles.appointmentsGrid}>
                    {appointments.map((appointment) => (
                        <div key={appointment._id} style={styles.appointmentCard}>
                            <h3>Dr. {appointment.doctor?.name || 'N/A'}</h3>
                            <p><strong>Email:</strong> {appointment.doctor?.email || 'N/A'}</p>
                            <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                            <p>
                                <strong>Status:</strong>
                                <span style={{
                                    color: appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'green' :
                                           appointment.status === 'cancelled' ? 'red' : 'orange', // Red for cancelled
                                    fontWeight: 'bold'
                                }}>
                                    {appointment.status}
                                </span>
                            </p>
                            {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
                            {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}

                            {/* --- NEW: Conditional Cancel Button --- */}
                            {/* Only show cancel button if appointment is 'scheduled' or 'confirmed' */}
                            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                <button
                                    onClick={() => handleCancel(appointment._id)}
                                    style={styles.cancelButton}
                                    disabled={isLoading} // Disable button while another operation is loading
                                >
                                    Cancel Appointment
                                </button>
                            )}
                            {/* Display cancellation details if cancelled */}
                            {appointment.status === 'cancelled' && appointment.cancellationDate && (
                                <p style={styles.cancellationInfo}>
                                    Cancelled on: {formatDate(appointment.cancellationDate)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    },
    heading: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '30px',
        fontWeight: '600',
    },
    noAppointments: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#666',
        padding: '20px',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    appointmentsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    appointmentCard: {
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease-in-out',
        display: 'flex', // Use flexbox for better layout of content and button
        flexDirection: 'column',
        justifyContent: 'space-between', // Pushes button to bottom
    },
    cancelButton: {
        backgroundColor: '#dc3545', // Red color for cancel
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 15px',
        marginTop: '15px', // Space above the button
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        alignSelf: 'flex-end', // Align button to the right within the flex column
    },
    cancellationInfo: {
        fontSize: '0.85em',
        color: '#888',
        fontStyle: 'italic',
        marginTop: '10px',
        borderTop: '1px dashed #eee',
        paddingTop: '5px',
    }
};

export default MyAppointmentsPage;
