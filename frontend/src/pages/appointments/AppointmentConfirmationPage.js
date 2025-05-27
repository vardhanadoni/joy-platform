// frontend/src/pages/appointments/AppointmentConfirmationPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AppointmentConfirmationPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Appointment Booked Successfully!</h1>
      <p>Thank you for booking your appointment. Details have been sent to your email.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
      {/* You could add more details here, like a summary of the appointment */}
    </div>
  );
}

export default AppointmentConfirmationPage;