import React from 'react';
import { Link } from 'react-router-dom';
import FolderList from '../components/FolderList';

function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <Link to="/">Go to Home Page</Link>
      <br />
      <Link to="/upload-and-gallery">Go to Upload and Gallery Page</Link>
      <FolderList />
    </div>
  );
}

export default AdminPage;