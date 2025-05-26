// client/src/pages/documents/PatientDocumentsPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import patientService from '../../services/patientService';
import { useAuth } from '../../contexts/AuthContext';

const PatientDocumentsPage = () => {
  const { token } = useAuth();
  const [documentFile, setDocumentFile] = useState(null);
  const [retinalImageFile, setRetinalImageFile] = useState(null);
  const [documentType, setDocumentType] = useState('other'); // Default type for general documents
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isUploadingRetinalImage, setIsUploadingRetinalImage] = useState(false);

  // Fetch all patient documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      if (token) {
        try {
          setLoadingDocuments(true);
          const fetchedDocuments = await patientService.getPatientDocuments(token);
          setDocuments(fetchedDocuments);
        } catch (error) {
          toast.error(error.message || 'Error fetching documents.');
        } finally {
          setLoadingDocuments(false);
        }
      }
    };
    fetchDocuments();
  }, [token]);

  // Handle general document file selection
  const onDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  // Handle retinal image file selection
  const onRetinalImageFileChange = (e) => {
    setRetinalImageFile(e.target.files[0]);
  };

  // Handle general document type selection
  const onDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  // Handle general document upload submission
  const onSubmitDocument = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      toast.error('Please select a document file to upload.');
      return;
    }
    setIsUploadingDocument(true);
    const formData = new FormData();
    formData.append('documentFile', documentFile); // 'documentFile' matches multer field name in backend
    formData.append('documentType', documentType);

    try {
      const response = await patientService.uploadDocument(formData, token);
      toast.success(response.message);
      setDocumentFile(null); // Clear selected file
      setDocumentType('other'); // Reset document type
      // Re-fetch documents to update the list
      const updatedDocuments = await patientService.getPatientDocuments(token);
      setDocuments(updatedDocuments);
    } catch (error) {
      toast.error(error.message || 'Document upload failed.');
    } finally {
      setIsUploadingDocument(false);
    }
  };

  // Handle retinal image upload submission
  const onSubmitRetinalImage = async (e) => {
    e.preventDefault();
    if (!retinalImageFile) {
      toast.error('Please select a retinal image file to upload.');
      return;
    }
    setIsUploadingRetinalImage(true);
    const formData = new FormData();
    formData.append('retinalImage', retinalImageFile); // 'retinalImage' matches multer field name in backend

    try {
      const response = await patientService.uploadRetinalImage(formData, token);
      toast.success(response.message);
      setRetinalImageFile(null); // Clear selected file
      // Re-fetch documents to update the list, including the new prediction
      const updatedDocuments = await patientService.getPatientDocuments(token);
      setDocuments(updatedDocuments);
    } catch (error) {
      toast.error(error.message || 'Retinal image upload and prediction failed.');
    } finally {
      setIsUploadingRetinalImage(false);
    }
  };

  // Helper to format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Documents & Retinal Scans</h2>

      {/* Upload General Document Section */}
      <div style={styles.uploadCard}>
        <h3 style={styles.subHeading}>Upload General Medical Document</h3>
        <form onSubmit={onSubmitDocument}>
          <div style={styles.formGroup}>
            <label htmlFor="documentFile" style={styles.label}>Select Document:</label>
            <input
              type="file"
              id="documentFile"
              onChange={onDocumentFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={styles.fileInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="documentType" style={styles.label}>Document Type:</label>
            <select
              id="documentType"
              value={documentType}
              onChange={onDocumentTypeChange}
              style={styles.select}
            >
              <option value="other">Other</option>
              <option value="prescription">Prescription</option>
              <option value="id_proof">ID Proof</option>
            </select>
          </div>
          <button type="submit" style={styles.button} disabled={isUploadingDocument}>
            {isUploadingDocument ? 'Uploading Document...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* Upload Retinal Image Section */}
      <div style={styles.uploadCard}>
        <h3 style={styles.subHeading}>Upload Retinal Image for DR Prediction</h3>
        <form onSubmit={onSubmitRetinalImage}>
          <div style={styles.formGroup}>
            <label htmlFor="retinalImageFile" style={styles.label}>Select Retinal Image:</label>
            <input
              type="file"
              id="retinalImageFile"
              onChange={onRetinalImageFileChange}
              accept=".jpg,.jpeg,.png"
              style={styles.fileInput}
            />
          </div>
          <button type="submit" style={styles.button} disabled={isUploadingRetinalImage}>
            {isUploadingRetinalImage ? 'Processing Image...' : 'Upload & Get Prediction'}
          </button>
        </form>
      </div>

      {/* Display Documents Section */}
      <div style={styles.documentsListCard}>
        <h3 style={styles.subHeading}>Your Uploaded Documents</h3>
        {loadingDocuments ? (
          <p style={{ textAlign: 'center' }}>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No documents uploaded yet.</p>
        ) : (
          <ul style={styles.listContainer}>
            {documents.map((doc) => (
              <li key={doc._id} style={styles.listItem}>
                <div style={styles.docDetails}>
                  <strong>{doc.fileName}</strong> ({doc.documentType.replace(/_/g, ' ')})
                  <br />
                  <span style={styles.uploadDate}>Uploaded: {formatDate(doc.uploadDate)}</span>
                  <br />
                  {/* Display prediction results for retinal images */}
                  {doc.documentType === 'retinal_image' && doc.prediction && (
                    <div style={styles.predictionDetails}>
                      <p><strong>Prediction:</strong> <span style={doc.prediction.predictionResult === 'No DR' ? styles.noDR : styles.hasDR}>
                                                     {doc.prediction.predictionResult}
                                                    </span></p>
                      <p><strong>Confidence:</strong> {doc.prediction.confidenceScore ? `${(doc.prediction.confidenceScore * 100).toFixed(2)}%` : 'N/A'}</p>
                      {doc.prediction.modelMessage && <p style={styles.modelMessage}>Model Info: {doc.prediction.modelMessage}</p>}
                    </div>
                  )}
                  {/* You could add a link to download the document here if you set up a download route */}
                  {/* <a href={`/api/documents/download/${doc._id}`} target="_blank" rel="noopener noreferrer">Download</a> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
  },
  subHeading: {
    color: '#555',
    marginBottom: '20px',
    fontSize: '22px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  uploadCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#666',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
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
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  documentsListCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
  },
  listContainer: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#f4f7f6',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  docDetails: {
    flex: '1',
    minWidth: '280px',
  },
  uploadDate: {
    fontSize: '0.9em',
    color: '#888',
  },
  predictionDetails: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
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
};

export default PatientDocumentsPage;