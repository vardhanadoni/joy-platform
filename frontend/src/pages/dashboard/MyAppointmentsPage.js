// frontend/src/pages/dashboard/MyAppointmentsPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getMyAppointments } from '../../services/patientSlice'; // Assuming this thunk fetches all patient appointments
import Spinner from '../../components/ui/Spinner';

const MyAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading, isError, message } = useSelector(
        (state) => state.patient
    );

    useEffect(() => {
        // Fetch appointments when the component mounts
        dispatch(getMyAppointments());

        if (isError) {
            toast.error(message);
        }
    }, [dispatch, isError, message]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                            <p><strong>Status:</strong> <span style={{ color: appointment.status === 'confirmed' ? 'green' : 'orange', fontWeight: 'bold' }}>{appointment.status}</span></p>
                            {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
                            {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                            {/* Add more details as needed */}
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
    },
};

export default MyAppointmentsPage;