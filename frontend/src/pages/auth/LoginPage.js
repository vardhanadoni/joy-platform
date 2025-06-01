// frontend/src/pages/auth/LoginPage.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import authService from '../../services/authService'; // Adjust path if needed
// import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const { email, password } = formData;

//   const navigate = useNavigate();
//   const { user, login } = useAuth(); // Get user and login function from AuthContext

//   // Redirect if user is already logged in
//   useEffect(() => {
//     if (user) {
//       navigate('/dashboard'); // Or navigate to dashboard based on role
//     }
//   }, [user, navigate]);

//   const onChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Call login service from authService
//       const userData = await authService.login({ email, password });
      
//       // If login successful, update AuthContext state
//       login(userData, userData.token);
      
//       toast.success('Login successful!');
//       navigate('/dashboard'); // Redirect to dashboard after successful login
//     } catch (error) {
//       toast.error(error.message || 'Login failed.');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formCard}>
//         <h2 style={styles.heading}>Login to Your Account</h2>
//         <form onSubmit={onSubmit}>
//           <div style={styles.formGroup}>
//             <label htmlFor="email" style={styles.label}>Email Address:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={onChange}
//               placeholder="Enter your email"
//               required
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="password" style={styles.label}>Password:</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={onChange}
//               placeholder="Enter your password"
//               required
//               style={styles.input}
//             />
//           </div>
//           <button type="submit" style={styles.button}>Login</button>
//         </form>
//         <p style={styles.textCenter}>
//           Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// frontend/src/pages/auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../services/authSlice'; // Import Redux login thunk
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner'; // Assuming you have a Spinner component

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.name || user.email}!`);
      navigate('/dashboard');
    }

    if (isError || isSuccess) {
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={styles.container}> {/* Using a div to apply overall container styles */}
      <div style={styles.formCard}>
        <h1 style={styles.heading}>Login</h1>
        <form onSubmit={onSubmit}>
          <div style={styles.formGroup}>
            <input
              type='email'
              style={styles.input} // Apply input style
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type='password'
              style={styles.input} // Apply input style
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <button type='submit' style={styles.button}> {/* Apply button style */}
              {isLoading ? 'Logging In...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Inline Styles Object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Full viewport height
    backgroundColor: '#f0f2f5', // Light grey background
    padding: '20px',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '400px', // Fixed width for the form card
    maxWidth: '90%', // Ensures it's responsive on smaller screens
    textAlign: 'center', // Center text within the card
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease-in-out',
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  inputFocus: { // You'd need to handle this with a pseudo-class in CSS, or onFocus/onBlur in React
    borderColor: '#007bff',
  },
  button: {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
  },
  buttonHover: { // You'd need to handle this with a pseudo-class in CSS
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
  buttonDisabled: { // For when isLoading is true
    backgroundColor: '#a0c7ed',
    cursor: 'not-allowed',
  },
};

export default LoginPage;