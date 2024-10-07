import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import UploadAndGalleryPage from './pages/UploadAndGalleryPage';
import UserPage from './pages/UserPage'; // Import the new UserPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/upload-and-gallery" element={<UploadAndGalleryPage />} />
        <Route path="/user" element={<UserPage />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;