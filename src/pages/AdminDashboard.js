import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  
  const projects = [
    { id: 'P001', name: 'Respiratory Health Project', description: 'Project focused on respiratory disease analysis.' },
    { id: 'P002', name: 'Cardiovascular Health Study', description: 'Study on cardiovascular health conditions.' },
    { id: 'P003', name: 'Neurological Study Project', description: 'Research on neurological health and disorders.' },
    { id: 'P004', name: 'Oncology Research Project', description: 'Analysis of cancer and related diseases.' },
    { id: 'P009', name: 'Infectious Disease Control Study', description: 'Study on controlling infectious diseases.' },
    { id: 'P010', name: 'Nutrition and Wellness Program', description: 'Program promoting nutrition and overall wellness.' },
  ];

  const handleViewProject = (id) => {
    navigate(`/labeling-interface`);
  };

  const handleEditProject = (id) => {
    navigate(`/admin-project-page`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
      <h2>Admin Dashboard</h2>
      <p>All Projects</p>
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="button-group">
              <button className="view-button" onClick={() => handleViewProject(project.id)}>View Project</button>
              <button className="edit-button" onClick={() => handleEditProject(project.id)}>Edit Project</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
