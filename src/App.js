import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjectPage from './pages/Admin/AdminProjectPage';
import LabelingInterface from './pages/labeling/LabelingInterface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-project-page" element={<AdminProjectPage />} />
        <Route path="/admin-project-page" element={<AdminProjectPage />} />
        <Route path="/labeling-interface" element={<LabelingInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
