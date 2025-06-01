// // frontend/src/pages/dashboard/PatientDashboard.js
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import patientService from '../../services/patientService';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link } from 'react-router-dom'; // For navigation

// const PatientDashboard = () => {
//   const { user, token } = useAuth();
//   const [patientProfile, setPatientProfile] = useState(null);
//   const [latestPrediction, setLatestPrediction] = useState(null);
//   const [recentDocuments, setRecentDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         // 1. Fetch Patient Profile
//         const profile = await patientService.getProfile(token);
//         // If profile is null from backend (no profile yet), use user's name for display
//         if (profile && profile.fullName) {
//             setPatientProfile(profile);
//         } else {
//             setPatientProfile({ fullName: user?.name, email: user?.email, ...profile });
//         }


//         // 2. Fetch all patient documents to find the latest retinal image prediction
//         const documents = await patientService.getPatientDocuments(token);
//         const retinalImages = documents.filter(
//           (doc) => doc.documentType === 'retinal_image' && doc.prediction
//         );

//         // Sort by upload date (most recent first) and get the latest
//         retinalImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//         if (retinalImages.length > 0) {
//           setLatestPrediction(retinalImages[0].prediction);
//         }

//         // Get recent general documents (e.g., last 3, excluding retinal images)
//         const generalDocs = documents.filter(doc => doc.documentType !== 'retinal_image');
//         generalDocs.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//         setRecentDocuments(generalDocs.slice(0, 3)); // Show up to 3 recent general docs

//       } catch (error) {
//         toast.error(error.message || 'Error fetching dashboard data.');
//         console.error('Dashboard data fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [token, user]); // Re-fetch if token or user context changes

//   if (loading) {
//     return <div style={styles.loadingContainer}>Loading dashboard...</div>;
//   }

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div style={styles.dashboardContainer}>
//       <h1 style={styles.welcomeHeading}>Welcome, {user?.name || 'Patient'}!</h1>

//       {/* Profile Snapshot */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Your Profile Snapshot</h2>
//         {patientProfile ? (
//           <div style={styles.profileDetails}>
//             <p><strong>Full Name:</strong> {patientProfile.fullName}</p>
//             <p><strong>Email:</strong> {user?.email}</p> {/* Email from user context */}
//             {patientProfile.dateOfBirth && <p><strong>Date of Birth:</strong> {formatDate(patientProfile.dateOfBirth)}</p>}
//             {patientProfile.gender && <p><strong>Gender:</strong> {patientProfile.gender}</p>}
//             {patientProfile.contactNumber && <p><strong>Contact:</strong> {patientProfile.contactNumber}</p>}
//             {patientProfile.address && <p><strong>Address:</strong> {patientProfile.address}</p>}
//             {patientProfile.medicalHistory && <p><strong>Medical History:</strong> {patientProfile.medicalHistory}</p>}
//             {patientProfile.currentMedications && <p><strong>Current Medications:</strong> {patientProfile.currentMedications}</p>}
//             <Link to="/patient/profile" style={styles.actionButton}>Update Profile</Link>
//           </div>
//         ) : (
//           <p>No detailed profile found. <Link to="/patient/profile" style={styles.link}>Create your profile</Link>.</p>
//         )}
//       </div>

//       {/* Latest Retinal Image Prediction Summary */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Latest Retinal Scan Prediction</h2>
//         {latestPrediction ? (
//           <div style={styles.predictionDetails}>
//             <p><strong>Result:</strong>
//               <span style={latestPrediction.predictionResult === 'No DR' ? styles.noDR : styles.hasDR}>
//                 {' '}{latestPrediction.predictionResult}
//               </span>
//             </p>
//             <p><strong>Confidence:</strong> {latestPrediction.confidenceScore ? `${(latestPrediction.confidenceScore * 100).toFixed(2)}%` : 'N/A'}</p>
//             <p><strong>Scanned On:</strong> {formatDate(latestPrediction.createdAt)}</p>
//             {latestPrediction.modelMessage && <p style={styles.modelMessage}>Model Info: {latestPrediction.modelMessage}</p>}
//             <Link to="/patient/documents" style={styles.actionButton}>View All Scans</Link>
//           </div>
//         ) : (
//           <p>No retinal image predictions found yet. <Link to="/patient/documents" style={styles.link}>Upload your first retinal image</Link>.</p>
//         )}
//       </div>

//       {/* Recent Documents */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Recent Documents</h2>
//         {recentDocuments.length > 0 ? (
//           <ul style={styles.listContainer}>
//             {recentDocuments.map((doc) => (
//               <li key={doc._id} style={styles.listItem}>
//                 <strong>{doc.fileName}</strong> ({doc.documentType.replace(/_/g, ' ')})
//                 <br />
//                 <span style={styles.uploadDate}>Uploaded: {formatDate(doc.uploadDate)}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No general documents uploaded recently.</p>
//         )}
//         <Link to="/patient/documents" style={styles.actionButton}>View All Documents</Link>
//       </div>

//       {/* Quick Actions (Optional, could be more prominent) */}
//     </div>
//   );
// };

// // Basic Inline Styles
// const styles = {
//   dashboardContainer: {
//     maxWidth: '1000px',
//     margin: '30px auto',
//     padding: '20px',
//     backgroundColor: '#f4f7f6',
//     borderRadius: '10px',
//     boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//   },
//   loadingContainer: {
//     textAlign: 'center',
//     padding: '50px',
//     fontSize: '18px',
//     color: '#666',
//   },
//   welcomeHeading: {
//     textAlign: 'center',
//     color: '#2c3e50',
//     marginBottom: '30px',
//     fontSize: '32px',
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: 'white',
//     padding: '25px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//     marginBottom: '25px',
//   },
//   cardHeading: {
//     color: '#34495e',
//     fontSize: '24px',
//     marginBottom: '20px',
//     borderBottom: '1px solid #eee',
//     paddingBottom: '10px',
//   },
//   profileDetails: {
//     fontSize: '16px',
//     lineHeight: '1.6',
//     color: '#444',
//   },
//   predictionDetails: {
//     fontSize: '16px',
//     lineHeight: '1.6',
//     color: '#444',
//   },
//   noDR: {
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   hasDR: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   modelMessage: {
//     fontSize: '0.9em',
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   listContainer: {
//     listStyle: 'none',
//     padding: 0,
//   },
//   listItem: {
//     backgroundColor: '#f9f9f9',
//     border: '1px solid #e0e0e0',
//     borderRadius: '5px',
//     padding: '12px',
//     marginBottom: '8px',
//     fontSize: '15px',
//     color: '#555',
//   },
//   uploadDate: {
//     fontSize: '0.85em',
//     color: '#777',
//   },
//   actionButton: {
//     display: 'inline-block',
//     backgroundColor: '#007bff',
//     color: 'white',
//     padding: '10px 18px',
//     borderRadius: '5px',
//     textDecoration: 'none',
//     marginTop: '15px',
//     fontSize: '16px',
//     transition: 'background-color 0.3s ease',
//   },
//   actionButtonHover: {
//     backgroundColor: '#0056b3',
//   },
//   link: {
//     color: '#007bff',
//     textDecoration: 'none',
//   },
//   quickActions: {
//     display: 'flex',
//     gap: '15px',
//     flexWrap: 'wrap',
//   },
//   quickActionButton: {
//     backgroundColor: '#28a745',
//     color: 'white',
//     padding: '12px 20px',
//     borderRadius: '5px',
//     textDecoration: 'none',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     transition: 'background-color 0.3s ease',
//   },
//   quickActionButtonHover: {
//     backgroundColor: '#218838',
//   },
// };

// export default PatientDashboard;





// frontend/src/pages/dashboard/PatientDashboard.js
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import patientService from '../../services/patientService'; // Assuming patientService is correctly imported
// import { useAuth } from '../../contexts/AuthContext'; // Assuming your AuthContext is correctly set up here
// import { Link, useNavigate } from 'react-router-dom'; // <--- Ensure useNavigate is also imported for redirection
// import { FaCalendarCheck } from 'react-icons/fa'; // <--- NEW: Import the icon for the button

// const PatientDashboard = () => {
//   const { user, token, isLoading } = useAuth(); // Destructure user and token from your AuthContext
//   const navigate = useNavigate(); // Initialize navigate hook

//   const [patientProfile, setPatientProfile] = useState(null);
//   const [latestPrediction, setLatestPrediction] = useState(null);
//   const [recentDocuments, setRecentDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   //console.log({user,token,isLoading});
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if(isLoading){
//         return;
//       }
//       if (!token && !user) {
//         // If no token, redirect to login (important for protected routes)
//         setLoading(false);
//         navigate('/login'); // Redirect to login page if not authenticated
//         return;
//       }
//       try {
//         // 1. Fetch Patient Profile
//         const profile = await patientService.getProfile(token);
//         // If profile is null from backend (no profile yet), use user's name for display
//         if (profile && profile.fullName) {
//           setPatientProfile(profile);
//         } else {
//           // Fallback if profile not found, use basic user info
//           setPatientProfile({ fullName: user?.name, email: user?.email, ...profile });
//         }

//         // 2. Fetch all patient documents to find the latest retinal image prediction
//         // Ensure patientService.getPatientDocuments is defined and works correctly
//         const documents = await patientService.getPatientDocuments(token);
//         const retinalImages = documents.filter(
//           (doc) => doc.documentType === 'retinal_image' && doc.prediction
//         );

//         // Sort by upload date (most recent first) and get the latest
//         retinalImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//         if (retinalImages.length > 0) {
//           setLatestPrediction(retinalImages[0].prediction);
//         }

//         // Get recent general documents (e.g., last 3, excluding retinal images)
//         const generalDocs = documents.filter(doc => doc.documentType !== 'retinal_image');
//         generalDocs.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//         setRecentDocuments(generalDocs.slice(0, 3)); // Show up to 3 recent general docs

//       } catch (error) {
//         toast.error(error.response?.data?.message || error.message || 'Error fetching dashboard data.');
//         console.error('Dashboard data fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [token, user, navigate]); // Add navigate to dependency array

//   if (loading) {
//     return <div style={styles.loadingContainer}>Loading dashboard...</div>;
//   }
// frontend/src/pages/dashboard/PatientDashboard.js
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react'
// import patientService from '../../services/patientService';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaCalendarCheck } from 'react-icons/fa';

// const PatientDashboard = () => {
//   // Correctly destructure isLoading here
//   const { user, token, isLoading } = useAuth(); // <--- ADDED isLoading HERE
//   const navigate = useNavigate();

//   const [patientProfile, setPatientProfile] = useState(null);
//   const [latestPrediction, setLatestPrediction] = useState(null);
//   const [recentDocuments, setRecentDocuments] = useState([]);
//   const [loading, setLoading] = useState(true); // Keep your existing 'loading' state for data fetching

//   useEffect(() => {
//     // Log for debugging (keep these for now)
//     console.log('PatientDashboard useEffect running. Auth state:', { user, token, isLoading });

//     // Phase 1: Handle authentication loading and unauthenticated state
//     if (isLoading) {
//         console.log('Auth is still loading...');
//         return; // Wait for authentication state to be determined
//     }

//     if (!user && !token) { // User is definitely not logged in
//         console.log('User not authenticated, redirecting to login...');
//         setLoading(false); // Ensure local loading is false before redirect
//         navigate('/login');
//         return;
//     }

//     // If we reach here, it means isLoading is false AND user/token exist (user is authenticated)
//     // Phase 2: Fetch dashboard data
//     const fetchDashboardData = async () => {
//         setLoading(true); // Start local loading for dashboard data
//         try {
//             const profile = await patientService.getProfile(token);
//             setPatientProfile(profile && profile.fullName ? profile : { fullName: user?.name, email: user?.email, ...profile });

//             const documents = await patientService.getPatientDocuments(token);
//             const retinalImages = documents.filter(
//                 (doc) => doc.documentType === 'retinal_image' && doc.prediction
//             ).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

//             if (retinalImages.length > 0) {
//                 setLatestPrediction(retinalImages[0].prediction);
//             }

//             const generalDocs = documents.filter(doc => doc.documentType !== 'retinal_image')
//                 .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
//             setRecentDocuments(generalDocs.slice(0, 3));

//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message || 'Error fetching dashboard data.');
//             console.error('Dashboard data fetch error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchDashboardData();

// }, [user, token, navigate, isLoading]); // These should be stable from useAuth // Add isLoading to dependency array

//   // Your existing loading return
//   if (loading) { // This loading state is for the dashboard data, distinct from auth isLoading
//     return <div style={styles.loadingContainer}>Loading dashboard...</div>;
//   }
//   // ... rest of your component
//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div style={styles.dashboardContainer}>
//       <h1 style={styles.welcomeHeading}>Welcome, {user?.name || 'Patient'}!</h1>

//       {/* Profile Snapshot */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Your Profile Snapshot</h2>
//         {patientProfile && (patientProfile.fullName || patientProfile.email) ? ( // Check if profile has any displayable data
//           <div style={styles.profileDetails}>
//             <p><strong>Full Name:</strong> {patientProfile.fullName}</p>
//             <p><strong>Email:</strong> {user?.email}</p> {/* Email from user context */}
//             {patientProfile.dateOfBirth && <p><strong>Date of Birth:</strong> {formatDate(patientProfile.dateOfBirth)}</p>}
//             {patientProfile.gender && <p><strong>Gender:</strong> {patientProfile.gender}</p>}
//             {patientProfile.contactNumber && <p><strong>Contact:</strong> {patientProfile.contactNumber}</p>}
//             {patientProfile.address && <p><strong>Address:</strong> {patientProfile.address}</p>}
//             {patientProfile.medicalHistory && <p><strong>Medical History:</strong> {patientProfile.medicalHistory}</p>}
//             {patientProfile.currentMedications && <p><strong>Current Medications:</strong> {patientProfile.currentMedications}</p>}
//             <Link to="/patient/profile" style={styles.actionButton}>Update Profile</Link>
//           </div>
//         ) : (
//           <p>No detailed profile found. <Link to="/patient/profile" style={styles.link}>Create your profile</Link>.</p>
//         )}
//       </div>

//       {/* Latest Retinal Image Prediction Summary */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Latest Retinal Scan Prediction</h2>
//         {latestPrediction ? (
//           <div style={styles.predictionDetails}>
//             <p><strong>Result:</strong>
//               <span style={latestPrediction.predictionResult === 'No DR' ? styles.noDR : styles.hasDR}>
//                 {' '}{latestPrediction.predictionResult}
//               </span>
//             </p>
//             <p><strong>Confidence:</strong> {latestPrediction.confidenceScore ? `${(latestPrediction.confidenceScore * 100).toFixed(2)}%` : 'N/A'}</p>
//             <p><strong>Scanned On:</strong> {formatDate(latestPrediction.createdAt)}</p>
//             {latestPrediction.modelMessage && <p style={styles.modelMessage}>Model Info: {latestPrediction.modelMessage}</p>}
//             <Link to="/patient/documents" style={styles.actionButton}>View All Scans</Link>
//           </div>
//         ) : (
//           <p>No retinal image predictions found yet. <Link to="/patient/documents" style={styles.link}>Upload your first retinal image</Link>.</p>
//         )}
//       </div>

//       {/* Recent Documents */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Recent Documents</h2>
//         {recentDocuments.length > 0 ? (
//           <ul style={styles.listContainer}>
//             {recentDocuments.map((doc) => (
//               <li key={doc._id} style={styles.listItem}>
//                 <strong>{doc.fileName}</strong> ({doc.documentType.replace(/_/g, ' ')})
//                 <br />
//                 <span style={styles.uploadDate}>Uploaded: {formatDate(doc.uploadDate)}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No general documents uploaded recently.</p>
//         )}
//         <Link to="/patient/documents" style={styles.actionButton}>View All Documents</Link>
//       </div>

//       {/* NEW: Quick Actions for Appointments */}
//       <div style={styles.card}>
//         <h2 style={styles.cardHeading}>Quick Actions</h2>
//         <div style={styles.quickActions}>
//           <Link to="/book-appointment" style={styles.quickActionButton}>
//             <FaCalendarCheck style={{ marginRight: '8px' }} /> Book New Appointment
//           </Link>
//           {/* You can add more quick action buttons here if needed */}
//           {/* Example: Link to view past appointments (future feature) */}
//           {/* <Link to="/my-appointments" style={styles.quickActionButton}>
//             <FaListAlt style={{ marginRight: '8px' }} /> View My Appointments
//           </Link> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Basic Inline Styles
// const styles = {
//   dashboardContainer: {
//     maxWidth: '1000px',
//     margin: '30px auto',
//     padding: '20px',
//     backgroundColor: '#f4f7f6',
//     borderRadius: '10px',
//     boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//   },
//   loadingContainer: {
//     textAlign: 'center',
//     padding: '50px',
//     fontSize: '18px',
//     color: '#666',
//   },
//   welcomeHeading: {
//     textAlign: 'center',
//     color: '#2c3e50',
//     marginBottom: '30px',
//     fontSize: '32px',
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: 'white',
//     padding: '25px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//     marginBottom: '25px',
//   },
//   cardHeading: {
//     color: '#34495e',
//     fontSize: '24px',
//     marginBottom: '20px',
//     borderBottom: '1px solid #eee',
//     paddingBottom: '10px',
//   },
//   profileDetails: {
//     fontSize: '16px',
//     lineHeight: '1.6',
//     color: '#444',
//   },
//   predictionDetails: {
//     fontSize: '16px',
//     lineHeight: '1.6',
//     color: '#444',
//   },
//   noDR: {
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   hasDR: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   modelMessage: {
//     fontSize: '0.9em',
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   listContainer: {
//     listStyle: 'none',
//     padding: 0,
//   },
//   listItem: {
//     backgroundColor: '#f9f9f9',
//     border: '1px solid #e0e0e0',
//     borderRadius: '5px',
//     padding: '12px',
//     marginBottom: '8px',
//     fontSize: '15px',
//     color: '#555',
//   },
//   uploadDate: {
//     fontSize: '0.85em',
//     color: '#777',
//   },
//   actionButton: { // Style for existing action buttons
//     display: 'inline-block',
//     backgroundColor: '#007bff',
//     color: 'white',
//     padding: '10px 18px',
//     borderRadius: '5px',
//     textDecoration: 'none',
//     marginTop: '15px',
//     fontSize: '16px',
//     transition: 'background-color 0.3s ease',
//   },
//   actionButtonHover: {
//     backgroundColor: '#0056b3',
//   },
//   link: { // Style for text links
//     color: '#007bff',
//     textDecoration: 'none',
//   },
//   quickActions: { // Container for new quick action buttons
//     display: 'flex',
//     gap: '15px',
//     flexWrap: 'wrap',
//     justifyContent: 'center', // Center buttons in the section
//     marginTop: '15px',
//   },
//   quickActionButton: { // Style for the new Book Appointment button
//     backgroundColor: '#28a745', // Green color
//     color: 'white',
//     padding: '12px 20px',
//     borderRadius: '5px',
//     textDecoration: 'none',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     display: 'flex', // To align icon and text
//     alignItems: 'center',
//     transition: 'background-color 0.3s ease',
//   },
//   quickActionButtonHover: {
//     backgroundColor: '#218838', // Darker green on hover
//   },
// };

// export default PatientDashboard;

//frontend/src/pages/dashboard/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Corrected import for toast
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaListAlt } from 'react-icons/fa'; // Added FaListAlt for view appointments link

import patientService from '../../services/patientService';
import { selectAuth } from '../../services/authSlice'; // Assuming this is your auth slice selector
import { getMyAppointments } from '../../services/patientSlice'; // Import the new thunk for patient's appointments
import Spinner from '../../components/ui/Spinner'; // Assuming you have a Spinner component

const PatientDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch

  // Use useSelector to get auth and patient slice states
  const { user, isLoading: authLoading } = useSelector(selectAuth);
  const {
    appointments, // This will be populated by getMyAppointments thunk
    isLoading: patientLoading, // Loading state specific to patientSlice operations (e.g., fetching appointments)
    isError: patientError,
    message: patientMessage,
  } = useSelector((state) => state.patient);

  const [patientProfile, setPatientProfile] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);

  // Use a combined loading state for initial render and data fetching
  const [dashboardDataLoading, setDashboardDataLoading] = useState(true);

  useEffect(() => {
    console.log('PatientDashboard useEffect running. Auth state:', { user, authLoading });

    // Phase 1: Handle authentication loading and unauthenticated state
    if (authLoading) {
      console.log('Auth is still loading...');
      return; // Wait for authentication state to be determined
    }

    if (!user) { // User is definitely not logged in
      console.log('User not authenticated, redirecting to login...');
      setDashboardDataLoading(false); // Ensure local loading is false before redirect
      navigate('/login');
      return;
    }

    // If we reach here, it means authLoading is false AND user exists (user is authenticated)
    // Phase 2: Fetch dashboard data (profile, predictions, documents, and appointments)
    const fetchDashboardData = async () => {
      setDashboardDataLoading(true); // Start local loading for dashboard data
      try {
        // Fetch profile
        const profile = await patientService.getProfile(user.token); // Use user.token from Redux
        setPatientProfile(profile && profile.fullName ? profile : { fullName: user?.name, email: user?.email, ...profile });

        // Fetch documents and process predictions
        const documents = await patientService.getPatientDocuments(user.token); // Use user.token
        const retinalImages = documents.filter(
          (doc) => doc.documentType === 'retinal_image' && doc.prediction
        ).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        if (retinalImages.length > 0) {
          setLatestPrediction(retinalImages[0].prediction);
        }

        const generalDocs = documents.filter(doc => doc.documentType !== 'retinal_image')
          .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setRecentDocuments(generalDocs.slice(0, 3));

        // Fetch appointments using Redux thunk
        dispatch(getMyAppointments());

      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Error fetching dashboard data.');
        console.error('Dashboard data fetch error:', error);
      } finally {
        setDashboardDataLoading(false);
      }
    };

    fetchDashboardData();

  }, [user, navigate, dispatch, authLoading]); // Dependencies include user, navigate, dispatch, and authLoading

  // Handle errors from patientSlice (e.g., if getMyAppointments fails)
  useEffect(() => {
    if (patientError) {
      toast.error(patientMessage);
    }
  }, [patientError, patientMessage]);


  // Combine loading states for the spinner
  if (dashboardDataLoading || patientLoading) {
    return <Spinner />; // Use your Spinner component
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter appointments for upcoming and past
  const now = new Date();
  const upcomingAppointments = appointments.filter(app => {
      // Ensure app.appointmentDate is treated as a string for safety, then extract date part
      const appDatePart = typeof app.appointmentDate === 'string' ? app.appointmentDate.split('T')[0] : new Date(app.appointmentDate).toISOString().split('T')[0];
      const appDateTime = new Date(`${appDatePart}T${app.appointmentTime}:00`);
      return appDateTime >= now;
  });

  const pastAppointments = appointments.filter(app => {
      const appDatePart = typeof app.appointmentDate === 'string' ? app.appointmentDate.split('T')[0] : new Date(app.appointmentDate).toISOString().split('T')[0];
      const appDateTime = new Date(`${appDatePart}T${app.appointmentTime}:00`);
      return appDateTime < now;
  });


  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.welcomeHeading}>Welcome, {user?.name || 'Patient'}!</h1>

      {/* Profile Snapshot */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Your Profile Snapshot</h2>
        {patientProfile && (patientProfile.fullName || patientProfile.email) ? (
          <div style={styles.profileDetails}>
            <p><strong>Full Name:</strong> {patientProfile.fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            {patientProfile.dateOfBirth && <p><strong>Date of Birth:</strong> {formatDate(patientProfile.dateOfBirth)}</p>}
            {patientProfile.gender && <p><strong>Gender:</strong> {patientProfile.gender}</p>}
            {patientProfile.contactNumber && <p><strong>Contact:</strong> {patientProfile.contactNumber}</p>}
            {patientProfile.address && <p><strong>Address:</strong> {patientProfile.address}</p>}
            {patientProfile.medicalHistory && <p><strong>Medical History:</strong> {patientProfile.medicalHistory}</p>}
            {patientProfile.currentMedications && <p><strong>Current Medications:</strong> {patientProfile.currentMedications}</p>}
            {/* <Link to="/patient/profile" style={styles.actionButton}>Update Profile</Link> */}
          </div>
        ) : (
          <p>No detailed profile found. <Link to="/patient/profile" style={styles.link}>Create your profile</Link>.</p>
        )}
      </div>

      {/* Latest Retinal Image Prediction Summary */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Latest Retinal Scan Prediction</h2>
        {latestPrediction ? (
          <div style={styles.predictionDetails}>
            <p><strong>Result:</strong>
              <span style={latestPrediction.predictionResult === 'No DR' ? styles.noDR : styles.hasDR}>
                {' '}{latestPrediction.predictionResult}
              </span>
            </p>
            <p><strong>Confidence:</strong> {latestPrediction.confidenceScore ? `${(latestPrediction.confidenceScore * 100).toFixed(2)}%` : 'N/A'}</p>
            <p><strong>Scanned On:</strong> {formatDate(latestPrediction.createdAt)}</p>
            {latestPrediction.modelMessage && <p style={styles.modelMessage}>Model Info: {latestPrediction.modelMessage}</p>}
            {/* <Link to="/patient/documents" style={styles.actionButton}>View All Scans</Link> */}
          </div>
        ) : (
          <p>No retinal image predictions found yet</p>
        )}
      </div>

      {/* Recent Documents */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Recent Documents</h2>
        {recentDocuments.length > 0 ? (
          <ul style={styles.listContainer}>
            {recentDocuments.map((doc) => (
              <li key={doc._id} style={styles.listItem}>
                <strong>{doc.fileName}</strong> ({doc.documentType.replace(/_/g, ' ')})
                <br />
                <span style={styles.uploadDate}>Uploaded: {formatDate(doc.uploadDate)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No general documents uploaded recently.</p>
        )}
        {/* <Link to="/patient/documents" style={styles.actionButton}>View All Documents</Link> */}
      </div>

      {/* Appointments Section (NEW) */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Your Appointments</h2>

        <h3 style={styles.subHeading}>Upcoming Appointments</h3>
        {upcomingAppointments.length > 0 ? (
          <div style={styles.appointmentsList}>
            {upcomingAppointments.map((app) => (
              <div key={app._id} style={styles.appointmentCard}>
                <h3>Dr. {app.doctor?.name || 'N/A'}</h3>
                <p>Email: {app.doctor?.email || 'N/A'}</p>
                <p>Date: {new Date(app.appointmentDate).toLocaleDateString()}</p>
                <p>Time: {app.appointmentTime}</p>
                <p>Status: {app.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming appointments.</p>
        )}

        <h3 style={styles.subHeading}>Past Appointments</h3>
        {pastAppointments.length > 0 ? (
          <div style={styles.appointmentsList}>
            {pastAppointments.map((app) => (
              <div key={app._id} style={{ ...styles.appointmentCard, ...styles.appointmentCardPast }}>
                <h3>Dr. {app.doctor?.name || 'N/A'}</h3>
                <p>Email: {app.doctor?.email || 'N/A'}</p>
                <p>Date: {new Date(app.appointmentDate).toLocaleDateString()}</p>
                <p>Time: {app.appointmentTime}</p>
                <p>Status: {app.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No past appointments.</p>
        )}
      </div>


      {/* Quick Actions for Appointments */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Quick Actions</h2>
        <div style={styles.quickActions}>
          <Link to="/book-appointment" style={styles.quickActionButton}>
            <FaCalendarCheck style={{ marginRight: '8px' }} /> Book New Appointment
          </Link>
          <Link to="/my-appointments" style={styles.quickActionButton}> {/* Assuming this route for viewing all appointments */}
             <FaListAlt style={{ marginRight: '8px' }} /> View All Appointments
          </Link>
        </div>
      </div>
    </div>
  );
};

// Basic Inline Styles (corrected syntax)
const styles = {
  dashboardContainer: {
    maxWidth: '1000px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f4f7f6',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  welcomeHeading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '32px',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '25px',
  },
  cardHeading: {
    color: '#34495e',
    fontSize: '24px',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  subHeading: {
    color: '#4a69bd',
    fontSize: '20px',
    marginTop: '25px',
    marginBottom: '15px',
    borderBottom: '1px dashed #e9e9e9',
    paddingBottom: '5px',
  },
  profileDetails: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
  },
  predictionDetails: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
  },
  noDR: {
    color: 'green',
    fontWeight: 'bold',
  },
  hasDR: {
    color: 'red',
    fontWeight: 'bold',
  },
  modelMessage: {
    fontSize: '0.9em',
    color: '#666',
    fontStyle: 'italic',
  },
  listContainer: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#555',
  },
  uploadDate: {
    fontSize: '0.85em',
    color: '#777',
  },
  actionButton: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '5px',
    textDecoration: 'none',
    marginTop: '15px',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  quickActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '15px',
  },
  quickActionButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s ease',
    whiteSpace: 'nowrap', // Prevent text wrapping
  },
  // Styles for appointment cards
  appointmentsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  appointmentCard: {
    backgroundColor: '#eaf4ff',
    border: '1px solid #cce5ff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease-in-out',
  },
  // Removed invalid inline style syntax for :hover and child selectors
  // These should be in your CSS file (e.g., index.css)
  appointmentCardPast: { // Style for past appointments
    backgroundColor: '#f8f9fa',
    borderColor: '#e2e6ea',
    opacity: '0.8',
    filter: 'grayscale(10%)',
  },
};

export default PatientDashboard;