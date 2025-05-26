// client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed

const PrivateRoute = () => {
  const { user, isLoading } = useAuth(); // Get user and isLoading state from AuthContext
  console.log('PrivateRoute check:',{user,isLoading});
  if (isLoading) {
    // Optionally, render a loading spinner or message while checking auth status
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  // If user is logged in, render the child routes (Outlet)
  // Otherwise, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;