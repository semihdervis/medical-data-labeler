import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  
  const projects = [
    { id: 'P001', name: 'Respiratory Health Project', description: 'Project focused on respiratory disease analysis.' },
    { id: 'P002', name: 'Cardiovascular Health Study', description: 'Study on cardiovascular health conditions.' },
    { id: 'P003', name: 'Neurological Study Project', description: 'Research on neurological health and disorders.' },
    { id: 'P004', name: 'Oncology Research Project', description: 'Analysis of cancer and related diseases.' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="doctor-dashboard">
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
      <h2>Doctor Dashboard</h2>
      <p>Assigned Projects</p>
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button className="view-button">View Project</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;
