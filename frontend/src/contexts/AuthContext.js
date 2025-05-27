// // frontend/src/contexts/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create the context
// const AuthContext = createContext(undefined);

// // Create the AuthProvider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // To manage initial loading state from localStorage

//   // On initial load, try to retrieve user and token from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');

//     if (storedUser && storedToken) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         setToken(storedToken);
//       } catch (error) {
//         console.error("Failed to parse user from localStorage:", error);
//         // Clear invalid data if parsing fails
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
//     setIsLoading(false); // Finished checking localStorage
//   }, []); // Empty dependency array means this runs only once on mount

//   // Function to handle user login
//   const login = (userData, jwtToken) => {
//     setUser(userData);
//     setToken(jwtToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', jwtToken);
//   };

//   // Function to handle user logout
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   // Context value to be provided to consuming components
//   const contextValue = {
//     user,
//     token,
//     login,
//     logout,
//     isLoading,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to easily consume the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// frontend/src/contexts/AuthContext.js

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   // Initialize state from localStorage on component mount
//   // This ensures the user is loaded if the page is refreshed and they were logged in.
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Failed to parse user from localStorage on init:", error);
//       // In case of parsing error, treat as no user logged in
//       localStorage.removeItem('user'); // Clean up corrupted data
//       return null;
//     }
//   });

//   // useEffect to synchronize user state with localStorage
//   // This runs whenever the 'user' state changes.
//   useEffect(() => {
//     if (user) {
//       // If user is not null, save it to localStorage
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       // If user is null (e.g., after logout), remove from localStorage
//       localStorage.removeItem('user');
//       console.log("AuthContext: User data removed from localStorage."); // Debugging
//     }
//   }, [user]); // Dependency array: run when 'user' state changes

//   // Function to handle user login
//   const login = async (userData) => {
//     try {
//       const response = await axios.post('/api/users/login', userData);
//       if (response.data) {
//         setUser(response.data); // Update context state, useEffect will handle localStorage
//         toast.success(`Welcome back, ${response.data.name}!`);
//         return response.data;
//       }
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       toast.error(message);
//       setUser(null); // Ensure user is null on failed login attempt
//       throw new Error(message); // Re-throw to allow component to catch and handle
//     }
//   };

//   // Function to handle user registration
//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/api/users/register', userData);
//       if (response.data) {
//         setUser(response.data); // Update context state, useEffect will handle localStorage
//         toast.success(`Welcome, ${response.data.name}! Your account has been created.`);
//         return response.data;
//       }
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       toast.error(message);
//       setUser(null); // Ensure user is null on failed registration attempt
//       throw new Error(message); // Re-throw to allow component to catch and handle
//     }
//   };

//   // Function to handle user logout
//   const logout = () => {
//     setUser(null); // Set user state to null. The useEffect above will then remove from localStorage.
//     // No need to call localStorage.removeItem here directly.
//     console.log("AuthContext: User state set to null, initiating localStorage cleanup.");
//   };

//   // --- OPTIONAL: Axios Interceptor for attaching token ---
//   // If your backend routes require authorization headers, this is a clean way to add them.
//   useEffect(() => {
//     const interceptor = axios.interceptors.request.use(
//       (config) => {
//         // If user exists and has a token, add it to the Authorization header
//         if (user && user.token) {
//           config.headers.Authorization = `Bearer ${user.token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Cleanup function: Remove the interceptor when the component unmounts or user changes
//     return () => {
//       axios.interceptors.request.eject(interceptor);
//     };
//   }, [user]); // Re-run effect if 'user' object changes (e.g., token updates)


//   // Provide the user state and functions to consumers of the context
//   const value = {
//     user,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to consume the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// frontend/src/contexts/AuthContext.js
// frontend/src/contexts/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       // Set Axios default header if user exists in localStorage on initial load
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser && parsedUser.token) {
//           // This ensures token is set even on page refresh
//           axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
//         }
//         return parsedUser;
//       }
//       return null;
//     } catch (error) {
//       console.error("Failed to parse user from localStorage on init:", error);
//       localStorage.removeItem('user'); // Clean up corrupted data
//       return null;
//     }
//   });

//   // This useEffect ensures localStorage is always in sync with 'user' state
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//       // Also clear Axios default header on logout or failed login
//       delete axios.defaults.headers.common['Authorization'];
//       console.log("AuthContext: User data removed from localStorage and Axios header cleared.");
//     }
//   }, [user]);

//   const login = async (userData) => {
//     try {
//       // Use relative path. The proxy will handle forwarding to http://localhost:5000/api/users/login
//       const response = await axios.post('/api/users/login', userData);
//       if (response.data) {
//         // **IMPORTANT:** Set Axios default header immediately after successful login
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//         setUser(response.data); // Update state, useEffect will handle localStorage
//         toast.success(`Welcome back, ${response.data.name}!`);
//         return response.data;
//       }
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       toast.error(message);
//       setUser(null); // Ensure user is null on failed login attempt
//       // Ensure header is cleared on failed login as well, in case it was partially set
//       delete axios.defaults.headers.common['Authorization'];
//       throw new Error(message); // Re-throw to propagate error for forms
//     }
//   };

//   const register = async (userData) => {
//     try {
//       // Use relative path. The proxy will handle forwarding.
//       const response = await axios.post('/api/users/register', userData);
//       if (response.data) {
//         // **IMPORTANT:** Set Axios default header immediately after successful registration
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//         setUser(response.data);
//         toast.success(`Welcome, ${response.data.name}! Your account has been created.`);
//         return response.data;
//       }
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       toast.error(message);
//       setUser(null);
//       // Ensure header is cleared on failed registration as well
//       delete axios.defaults.headers.common['Authorization'];
//       throw new Error(message);
//     }
//   };

//   const logout = () => {
//     setUser(null); // This will trigger the useEffect, which clears localStorage and Axios header
//     console.log("AuthContext: User state set to null, initiating logout cleanup.");
//   };

//   // REMOVE THE AXIOS INTERCEPTOR useEffect from here.
//   // The default headers mechanism (axios.defaults.headers.common) is sufficient for this purpose.
//   // The interceptor approach is more for dynamic header logic or response handling.
//   // useEffect(() => {
//   //   const interceptor = axios.interceptors.request.use(
//   //     (config) => {
//   //       if (user && user.token && config.url.startsWith('/api')) {
//   //         config.headers.Authorization = `Bearer ${user.token}`;
//   //       }
//   //       return config;
//   //     },
//   //     (error) => Promise.reject(error)
//   //   );
//   //   return () => {
//   //     axios.interceptors.request.eject(interceptor);
//   //   };
//   // }, [user]);


//   const value = {
//     user,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// import React, { createContext, useContext } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../services/authSlice'; // Import Redux logout thunk
// import { selectAuth } from '../services/authSlice'; // A selector for auth state

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const { user, isLoading, isError, message } = useSelector(selectAuth); // Get auth state from Redux

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch Redux logout thunk
//   };

//   const value = {
//     user,
//     isLoading,
//     isError,
//     message,
//     logout: handleLogout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// src/contexts/AuthContext.js
import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../services/authSlice'; // Import Redux logout thunk
import { selectAuth } from '../services/authSlice'; // A selector for auth state

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(selectAuth); // Get auth state from Redux

  const handleLogout = () => {
    dispatch(logout()); // Dispatch Redux logout thunk
  };

  const value = {
    user,
    // >>> ADD THIS LINE <<<
    token: user?.token || null, // Explicitly expose the token from the user object
    isLoading,
    isError,
    message,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};