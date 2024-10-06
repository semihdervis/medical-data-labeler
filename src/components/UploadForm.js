// UploadForm.js
import React, { useState } from 'react';
import { storage, ref, uploadBytes } from '../firebase/config'; // Import necessary Firebase functions

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Allowed file types
  const types = ['image/png', 'image/jpeg'];

  // Handle file selection
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && types.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select an image file (png or jpeg)');
    }
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) return;

    // Create a storage reference
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);
      alert('File uploaded successfully!');
      setFile(null); // Clear the file input after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload the file');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <label>
        <h3>Upload an image</h3>
        <input type="file" onChange={handleChange} />
      </label>
      <div>
        <button type="submit" disabled={!file}>Upload</button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default UploadForm;
