// // frontend/src/App.jsx
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // We will import our page components here as we create them.
// // For now, they are commented out to prevent errors until the files exist.
// import HomePage from './pages/home/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import DashboardPage from './pages/dashboard/DashboardPage';
// import PatientProfilePage from './pages/profile/PatientProfilePage';
// import PatientDocumentsPage from './pages/documents/PatientDocumentsPage';

// function App() {
//   return (
//     <>
//       {/* ToastContainer for showing notifications */}
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

//       <div className="App">
//         {/* Navigation Bar will likely go here later */}

//         <Routes>
//           {/* Temporary route to confirm setup is working */}
//           <Route path="/" element={<h2>Frontend Setup Complete! Ready to Build Pages.</h2>} />

//           {/* These routes will be uncommented as we create the actual page components */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/profile" element={<PatientProfilePage />} />
//           <Route path="/documents" element={<PatientDocumentsPage />} />
//         </Routes>

//         {/* Footer will likely go here later */}
//       </div>
//     </>
//   );
// }

// export default App;


// frontend/src/App.js
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Import components
// import Navbar from './components/layout/Navbar'; // Import Navbar
// import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

// // Import all your page components
// import HomePage from './pages/home/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import DashboardPage from './pages/dashboard/DashboardPage';
// import PatientProfilePage from './pages/profile/PatientProfilePage';
// import PatientDocumentsPage from './pages/documents/PatientDocumentsPage';

// function App() {
//   return (
//     <>
//       {/* ToastContainer for displaying notifications */}
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

//       <div className="App">
//         {/* Navbar will always be present at the top */}
//         <Navbar />

//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />

//           {/* Protected Routes - only accessible if logged in */}
//           <Route element={<PrivateRoute />}>
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="/profile" element={<PatientProfilePage />} />
//             <Route path="/documents" element={<PatientDocumentsPage />} />
//           </Route>
//         </Routes>

//         {/* Footer will be placed here later, outside of <Routes> */}
//       </div>
//     </>
//   );
// }

// export default App;



// frontend/src/App.js
// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Navbar from './components/layout/Navbar'; // Correct path for Navbar
import PrivateRoute from './components/PrivateRoute'; // Correct path for PrivateRoute

// Import all your patient-focused page components
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboardPage from './pages/dashboard/PatientDashboard'; // Ensure this is PatientDashboard
import PatientProfilePage from './pages/profile/PatientProfilePage';
import PatientDocumentsPage from './pages/documents/PatientDocumentsPage';
import BookAppointmentPage from './pages/dashboard/BookAppointmentPage';
import AppointmentConfirmationPage from './pages/appointments/AppointmentConfirmationPage'; 
import MyAppointmentsPage from './pages/dashboard/MyAppointmentsPage';

function App() {
  return (
    <>
      {/* ToastContainer for displaying notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <div className="App">
        {/* Navbar will always be present at the top */}
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - only accessible if logged in */}
          {/* We are removing RoleProtectedRoute for now as it's not implemented yet */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<PatientDashboardPage />} /> {/* Patient Dashboard */}
            <Route path="/profile" element={<PatientProfilePage />} />
            <Route path="/documents" element={<PatientDocumentsPage />} />
            <Route path='/book-appointment' element={<BookAppointmentPage />} />
            <Route path='/appointment-confirmation' element={<AppointmentConfirmationPage />} />
            <Route path='/my-appointments' element={<MyAppointmentsPage />} />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>

        {/* Footer will be placed here later, outside of <Routes> */}
      </div>
    </>
  );
}

export default App;