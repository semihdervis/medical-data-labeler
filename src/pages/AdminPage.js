import React from 'react';
import { Link } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import ImageGallery from '../components/ImageGallery';

function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <Link to="/">Go to Home Page</Link>
      <UploadForm />
      <h1>Image Gallery</h1>
      <ImageGallery />
    </div>
  );
}

export default AdminPage;