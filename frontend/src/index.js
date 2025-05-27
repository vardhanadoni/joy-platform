// // import React from 'react';
// // import ReactDOM from 'react-dom/frontend';
// // import './index.css';
// // import App from './App';
// // import reportWebVitals from './reportWebVitals';

// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>
// // );

// // // If you want to start measuring performance in your app, pass a function
// // // to log results (for example: reportWebVitals(console.log))
// // // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();


// // import React from 'react';
// // import ReactDOM from 'react-dom/frontend';
// // import './index.css';
// // import App from './App';
// // import reportWebVitals from './reportWebVitals';
// // import { BrowserRouter } from 'react-router-dom';
// // import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

// // const root = ReactDOM.createRoot(
// //   document.getElementById('root')
// // );
// // root.render(
// //   <React.StrictMode>
// //     <BrowserRouter>
// //       <AuthProvider> {/* Wrap App with AuthProvider to provide auth context */}
// //         <App />
// //       </AuthProvider>
// //     </BrowserRouter>
// //   </React.StrictMode>
// // );



// // frontend/src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/frontend';
// import './index.css'; // Or your main CSS file
// import App from './App';
// import { store } from './app/store'; // <--- IMPORT YOUR REDUX STORE
// import { Provider } from 'react-redux'; // <--- IMPORT THE REDUX PROVIDER
// import { ToastContainer } from 'react-toastify'; // <--- IMPORT ToastContainer
// import 'react-toastify/dist/ReactToastify.css'; // <--- IMPORT Toastify CSS
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}> {/* <--- WRAP YOUR APP WITH PROVIDER */}
//       <App />
//       <ToastContainer /> {/* <--- ADD ToastContainer FOR NOTIFICATIONS */}
//     </Provider>
//   </React.StrictMode>
// );

// reportWebVitals();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals




// frontend/src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/frontend';
// import './index.css'; // Or your main CSS file
// import App from './App';

// // Redux Imports
// import { store } from './app/store'; // Your Redux store
// import { Provider } from 'react-redux'; // Redux Provider

// // AuthContext Imports
// import { AuthProvider } from './contexts/AuthContext'; // <--- IMPORT YOUR AUTHPROVIDER

// // React Toastify Imports
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Web Vitals Import (if you want to keep it)
// import reportWebVitals from './reportWebVitals'; // <--- Ensure this is imported if you use it

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* Wrap with AuthProvider FIRST, then Redux Provider (or vice-versa, order often doesn't strictly matter here but this is a common pattern) */}
//     <AuthProvider> {/* <--- WRAP WITH AUTHPROVIDER */}
//       <Provider store={store}> {/* <--- WRAP WITH REDUX PROVIDER */}
//         <App />
//         {/* ToastContainer should be inside the Provider, or directly under App, but outside the Router */}
//         <ToastContainer />
//       </Provider>
//     </AuthProvider>
//   </React.StrictMode>
// );


// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Redux Imports
import { store } from './app/store'; // Your Redux store
import { Provider } from 'react-redux';

// Removed: import { injectStore } from './services/patientService'; // NO LONGER NEEDED
// Removed: injectStore(store); // NO LONGER NEEDED

// AuthContext Imports
import { AuthProvider } from './contexts/AuthContext';

// React Toastify Imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Web Vitals Import (if you want to keep it)
import reportWebVitals from './reportWebVitals';

// React Router DOM Imports
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* CORRECT ORDER: Provider first, then AuthProvider (if AuthProvider uses Redux hooks) */}
    <Provider store={store}> {/* <<< Provider is now the outermost wrapper for Redux */}
      <AuthProvider> {/* <<< AuthProvider is now inside the Provider */}
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();