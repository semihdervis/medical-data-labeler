import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageManager = ({ projectId, patientId }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [uploader, setUploader] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('uploader', uploader);
        formData.append('projectId', projectId);
        formData.append('patientId', patientId);

        try {
            await axios.post('/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadSuccess(); // Notify parent about successful upload
            // Clear form fields after successful submission
            setImage(null);
            setName('');
            setUploader('');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form className="image-upload-form" onSubmit={handleSubmit}>
            <h2>Upload Image</h2>
            <input type="text" placeholder="Image Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Uploader Name" value={uploader} onChange={(e) => setUploader(e.target.value)} required />
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default ImageManager;
