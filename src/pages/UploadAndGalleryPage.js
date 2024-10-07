import React from 'react';
import { Link } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import ImageGallery from '../components/ImageGallery';

function UploadAndGalleryPage() {
  return (
    <div>
      <h1>Upload and Gallery Page</h1>
      <Link to="/admin">Go to Admin Page</Link>
      <UploadForm />
      <h1>Image Gallery</h1>
      <ImageGallery />
    </div>
  );
}

export default UploadAndGalleryPage;