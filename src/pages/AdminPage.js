import React from 'react';
import { Link } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <Link to="/">Go to Home Page</Link>
      <UploadForm />
    </div>
  );
}

export default AdminPage;