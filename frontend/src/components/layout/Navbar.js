// // client/src/components/layout/Navbar.js
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

// const Navbar = () => {
//   const { user, logout } = useAuth(); // Get user and logout function from AuthContext
//   const navigate = useNavigate();

//   const onLogout = () => {
//     logout(); // Call the logout function from AuthContext
//     navigate('/login'); // Redirect to login page after logout
//     // Optionally, add a toast message: toast.info('You have been logged out.');
//   };

//   return (
//     <nav style={styles.navbar}>
//       <div style={styles.logo}>
//         <Link to="/" style={styles.logoLink}>
//           DR Platform
//         </Link>
//       </div>
//       <ul style={styles.navbarNav}>
//         {/* Links visible to all users */}
//         {!user && (
//           <>
//             <li style={styles.navItem}>
//               <Link to="/login" style={styles.navLink}>
//                 Login
//               </Link>
//             </li>
//             <li style={styles.navItem}>
//               <Link to="/register" style={styles.navLink}>
//                 Register
//               </Link>
//             </li>
//           </>
//         )}
//         {/* Links visible only to logged-in users */}
//         {user && (
//           <>
//             <li style={styles.navItem}>
//               <Link to="/dashboard" style={styles.navLink}>
//                 Dashboard
//               </Link>
//             </li>
//             <li style={styles.navItem}>
//               <Link to="/profile" style={styles.navLink}>
//                 Profile
//               </Link>
//             </li>
//             <li style={styles.navItem}>
//               <Link to="/documents" style={styles.navLink}>
//                 Documents
//               </Link>
//             </li>
//             <li style={styles.navItem}>
//               <button onClick={onLogout} style={styles.logoutButton}>
//                 Logout ({user.name})
//               </button>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// // Basic inline styles for demonstration.
// const styles = {
//   navbar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     padding: '15px 30px',
//     color: 'white',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//   },
//   logo: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//   },
//   logoLink: {
//     color: 'white',
//     textDecoration: 'none',
//   },
//   navbarNav: {
//     listStyle: 'none',
//     margin: 0,
//     padding: 0,
//     display: 'flex',
//     alignItems: 'center',
//   },
//   navItem: {
//     marginLeft: '25px',
//   },
//   navLink: {
//     color: 'white',
//     textDecoration: 'none',
//     fontSize: '17px',
//     transition: 'color 0.3s ease',
//   },
//   navLinkHover: {
//     color: '#007bff',
//   },
//   logoutButton: {
//     backgroundColor: '#dc3545',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '8px 15px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease',
//   },
//   logoutButtonHover: {
//     backgroundColor: '#c82333',
//   },
// };

// export default Navbar;



// client/src/components/layout/Navbar.js
// client/src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  // Determine where the logo should link to
  const getLogoLinkPath = () => {
    if (!user) {
      return "/"; // Not logged in, go to public home page
    } else if (user.role === 'patient') {
      return "/dashboard"; // Logged in as patient, go to patient dashboard
    } else if (user.role === 'doctor') {
      return "/doctor/dashboard"; // Logged in as doctor, go to doctor dashboard (future)
    }
    return "/"; // Fallback, though should ideally be covered by roles
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Use the dynamically determined path for the logo link */}
        <Link to={getLogoLinkPath()} style={styles.logo}>Diabetic Retinopathy Detection</Link>
        <ul style={styles.navList}>
          {!user ? ( // If no user (not logged in)
            <>
              <li style={styles.navItem}><Link to="/login" style={styles.navLink}>Login</Link></li>
              <li style={styles.navItem}><Link to="/register" style={styles.navLink}>Register</Link></li>
            </>
          ) : ( // If user is logged in
            <>
              {/* Only show patient links for now */}
              {user.role === 'patient' && (
                <>
                  <li style={styles.navItem}><Link to="/dashboard" style={styles.navLink}>Dashboard</Link></li>
                  <li style={styles.navItem}><Link to="/profile" style={styles.navLink}>Profile</Link></li>
                  <li style={styles.navItem}><Link to="/documents" style={styles.navLink}>Documents</Link></li>
                </>
              )}
              {/* Doctor-specific links will go here once implemented */}
              {/* <li style={styles.navItem}>
                <span style={styles.navText}>Hello, {user.name} ({user.role})</span>
              </li> */}
              <li style={styles.navItem}>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

// Basic inline styles (keep these as they are)
const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '15px 0',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    marginLeft: '25px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '17px',
    padding: '5px 0',
    transition: 'color 0.3s ease',
  },
  navLinkHover: {
    color: '#ecf0f1',
  },
  navText: {
    color: '#bdc3c7',
    fontSize: '16px',
    marginLeft: '10px',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '20px',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#c0392b',
  },
};

export default Navbar;