// components/Dashboard.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import DoctorDashboard from '../pages/DoctorDashboard';
import AdminDashboard from '../pages/AdminDashboard';

const Dashboard = () => {
  const location = useLocation();
  const { role } = location.state || { role: 'doctor' };

  return (
    <div>
      {role === 'doctor' && <DoctorDashboard />}
      {role === 'admin' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
