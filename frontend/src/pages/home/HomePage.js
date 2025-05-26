// client/src/pages/home/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the Diabetic Retinopathy Platform!</h1>
      <p>Your comprehensive solution for managing patient data and leveraging AI for DR detection.</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/login" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Login
        </Link>
        <Link to="/register" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;