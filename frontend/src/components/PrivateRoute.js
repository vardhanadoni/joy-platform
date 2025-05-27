// // frontend/src/components/PrivateRoute.js
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed

// const PrivateRoute = () => {
//   const { user, isLoading } = useAuth(); // Get user and isLoading state from AuthContext
//   console.log('PrivateRoute check:',{user,isLoading});
//   if (isLoading) {
//     // Optionally, render a loading spinner or message while checking auth status
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
//   }

//   // If user is logged in, render the child routes (Outlet)
//   // Otherwise, redirect to the login page
//   return user ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;


// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import Spinner from './ui/Spinner'; // Assuming you have a Spinner

const PrivateRoute = () => {
  // Get user and isLoading from Redux state
  const { user, isLoading } = useSelector((state) => state.auth);

  console.log('PrivateRoute check:', { user, isLoading }); // Keep this for debugging

  if (isLoading) {
    return <Spinner />; // Show spinner while checking auth status
  }

  // If user is logged in (not null), render the child routes, otherwise navigate to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;