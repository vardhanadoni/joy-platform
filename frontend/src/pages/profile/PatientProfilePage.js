// // frontend/src/pages/profile/PatientProfilePage.js
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import patientService from '../../services/patientService'; // Adjust path if needed
// import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

// const PatientProfilePage = () => {
//   const { user, token } = useAuth(); // Get user and token from AuthContext
//   const [profileData, setProfileData] = useState({
//     name: user?.name || '', // Pre-fill name from auth context
//     email: user?.email || '', // Pre-fill email from auth context
//     dateOfBirth: '',
//     gender: '',
//     address: '',
//     phone: '',
//     medicalHistory: '',
//     currentMedications: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     // Fetch profile data when the component mounts or user/token changes
//     const fetchProfile = async () => {
//       if (token) {
//         try {
//           const data = await patientService.getProfile(token);
//           // Only update state for fields that exist and are not null/undefined
//           setProfileData(prevState => ({
//             ...prevState,
//             // Ensure data is not null before assigning
//             dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '', // Format date for input type="date"
//             gender: data.gender || '',
//             address: data.address || '',
//             phone: data.phone || '',
//             medicalHistory: data.medicalHistory || '',
//             currentMedications: data.currentMedications || '',
//           }));
//         } catch (error) {
//           toast.error(error.message || 'Error fetching profile data.');
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchProfile();
//   }, [token]); // Re-run if token changes

//   const onChange = (e) => {
//     setProfileData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!token) {
//       toast.error('You must be logged in to update your profile.');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await patientService.updateProfile(profileData, token);
//       toast.success('Profile updated successfully!');
//     } catch (error) {
//       toast.error(error.message || 'Error updating profile.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.formCard}>
//         <h2 style={styles.heading}>Your Patient Profile</h2>
//         <form onSubmit={onSubmit}>
//           {/* Read-only fields from registration */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Name:</label>
//             <input type="text" value={profileData.name} style={styles.input} readOnly />
//           </div>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Email:</label>
//             <input type="email" value={profileData.email} style={styles.input} readOnly />
//           </div>

//           {/* Editable fields for medical history and personal info */}
//           <div style={styles.formGroup}>
//             <label htmlFor="dateOfBirth" style={styles.label}>Date of Birth:</label>
//             <input
//               type="date"
//               id="dateOfBirth"
//               name="dateOfBirth"
//               value={profileData.dateOfBirth}
//               onChange={onChange}
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="gender" style={styles.label}>Gender:</label>
//             <select
//               id="gender"
//               name="gender"
//               value={profileData.gender}
//               onChange={onChange}
//               style={styles.input}
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="address" style={styles.label}>Address:</label>
//             <input
//               type="text"
//               id="address"
//               name="address"
//               value={profileData.address}
//               onChange={onChange}
//               placeholder="Your full address"
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="phone" style={styles.label}>Phone:</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={profileData.phone}
//               onChange={onChange}
//               placeholder="Your phone number"
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="medicalHistory" style={styles.label}>Medical History (e.g., Diabetes onset, other conditions):</label>
//             <textarea
//               id="medicalHistory"
//               name="medicalHistory"
//               value={profileData.medicalHistory}
//               onChange={onChange}
//               placeholder="Provide details about your medical history pertinent to diabetes or other conditions."
//               rows="5"
//               style={{ ...styles.input, resize: 'vertical' }}
//             ></textarea>
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="currentMedications" style={styles.label}>Current Medications:</label>
//             <textarea
//               id="currentMedications"
//               name="currentMedications"
//               value={profileData.currentMedications}
//               onChange={onChange}
//               placeholder="List any medications you are currently taking."
//               rows="5"
//               style={{ ...styles.input, resize: 'vertical' }}
//             ></textarea>
//           </div>

//           <button type="submit" style={styles.button} disabled={isSubmitting}>
//             {isSubmitting ? 'Updating...' : 'Update Profile'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Basic inline styles (reused from auth pages)
// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: 'calc(100vh - 80px)', // Account for navbar height
//     backgroundColor: '#f4f7f6',
//     padding: '20px 0',
//   },
//   formCard: {
//     backgroundColor: 'white',
//     padding: '40px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     width: '600px', // Wider card for more fields
//     maxWidth: '95%',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '30px',
//     color: '#333',
//   },
//   formGroup: {
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '8px',
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   input: {
//     width: '100%',
//     padding: '12px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     boxSizing: 'border-box',
//     fontSize: '16px',
//   },
//   button: {
//     width: '100%',
//     padding: '12px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     fontSize: '18px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     marginTop: '20px',
//     transition: 'background-color 0.3s ease',
//   },
//   buttonHover: {
//     backgroundColor: '#0056b3',
//   },
// };

// export default PatientProfilePage;




// frontend/src/pages/profile/PatientProfilePage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import patientService from '../../services/patientService';
import { useAuth } from '../../contexts/AuthContext';

const PatientProfilePage = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState({
    // IMPORTANT: 'fullName' and 'contactNumber' match backend schema
    fullName: user?.name || '', // Initialized with user's registered name
    email: user?.email || '', // For display only, not part of PatientProfile model
    dateOfBirth: '',
    gender: '',
    address: '',
    contactNumber: '', // IMPORTANT: matches backend schema
    medicalHistory: '',
    currentMedications: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const data = await patientService.getProfile(token);
          setProfileData(prevState => ({
            ...prevState,
            // Map backend data to frontend state names
            fullName: data.fullName || user?.name || '', // Use data.fullName if exists, else user.name
            // email is not part of profile model, comes from user context
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '', // Format date for input type="date"
            gender: data.gender || '',
            address: data.address || '',
            contactNumber: data.contactNumber || '', // IMPORTANT: Matches backend 'contactNumber'
            medicalHistory: data.medicalHistory || '',
            currentMedications: data.currentMedications || '',
          }));
        } catch (error) {
          toast.error(error.message || 'Error fetching profile data.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If no token, no profile to load
      }
    };
    fetchProfile();
  }, [token, user]); // Depend on user as well, in case initial user context changes

  const onChange = (e) => {
    setProfileData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      toast.error('You must be logged in to update your profile.');
      setIsSubmitting(false);
      return;
    }

    // Prepare data to send to backend.
    // Ensure the keys here match your backend PatientProfile model exactly.
    const dataToSend = {
      fullName: profileData.fullName,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      address: profileData.address,
      contactNumber: profileData.contactNumber, // IMPORTANT: Sending 'contactNumber'
      medicalHistory: profileData.medicalHistory,
      currentMedications: profileData.currentMedications,
    };

    try {
      await patientService.updateProfile(dataToSend, token);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Error updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>Your Patient Profile</h2>
        <form onSubmit={onSubmit}>
          {/* Full Name field */}
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName" // Matches state and backend schema
              value={profileData.fullName}
              onChange={onChange}
              placeholder="Enter your full name"
              required // Matches schema requirement
              style={styles.input}
            />
          </div>
          {/* Email field (read-only for display, comes from User model) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input type="email" value={profileData.email} style={styles.input} readOnly />
          </div>

          {/* Date of Birth */}
          <div style={styles.formGroup}>
            <label htmlFor="dateOfBirth" style={styles.label}>Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth" // Matches state and backend schema
              value={profileData.dateOfBirth}
              onChange={onChange}
              required // Matches schema requirement
              style={styles.input}
            />
          </div>
          {/* Gender */}
          <div style={styles.formGroup}>
            <label htmlFor="gender" style={styles.label}>Gender:</label>
            <select
              id="gender"
              name="gender" // Matches state and backend schema
              value={profileData.gender}
              onChange={onChange}
              required // Matches schema requirement
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Address */}
          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>Address:</label>
            <input
              type="text"
              id="address"
              name="address" // Matches state and backend schema
              value={profileData.address}
              onChange={onChange}
              placeholder="Your full address"
              required // Matches schema requirement
              style={styles.input}
            />
          </div>
          {/* Contact Number */}
          <div style={styles.formGroup}>
            <label htmlFor="contactNumber" style={styles.label}>Phone/Contact Number:</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber" // Matches state and backend schema
              value={profileData.contactNumber}
              onChange={onChange}
              placeholder="Your phone number"
              required // Matches schema requirement
              style={styles.input}
            />
          </div>
          {/* Medical History */}
          <div style={styles.formGroup}>
            <label htmlFor="medicalHistory" style={styles.label}>Medical History (e.g., Diabetes onset, other conditions):</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory" // Matches state and backend schema
              value={profileData.medicalHistory}
              onChange={onChange}
              placeholder="Provide details about your medical history pertinent to diabetes or other conditions."
              rows="5"
              style={{ ...styles.input, resize: 'vertical' }}
            ></textarea>
          </div>
          {/* Current Medications */}
          <div style={styles.formGroup}>
            <label htmlFor="currentMedications" style={styles.label}>Current Medications:</label>
            <textarea
              id="currentMedications"
              name="currentMedications" // Matches state and backend schema
              value={profileData.currentMedications}
              onChange={onChange}
              placeholder="List any medications you are currently taking."
              rows="5"
              style={{ ...styles.input, resize: 'vertical' }}
            ></textarea>
          </div>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Basic inline styles (reused from auth pages)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)', // Account for navbar height
    backgroundColor: '#f4f7f6',
    padding: '20px 0',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '600px', // Wider card for more fields
    maxWidth: '95%',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default PatientProfilePage;