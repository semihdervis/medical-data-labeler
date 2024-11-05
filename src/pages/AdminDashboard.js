import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import logoutIcon from './icons/logout.png';

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    { id: 'P001', name: 'Respiratory Health Project', description: 'Project focused on respiratory disease analysis.' },
    { id: 'P002', name: 'Cardiovascular Health Study', description: 'Study on cardiovascular health conditions.' },
    { id: 'P003', name: 'Neurological Study Project', description: 'Research on neurological health and disorders.' },
    { id: 'P004', name: 'Oncology Research Project', description: 'Analysis of cancer and related diseases.' },
    { id: 'P009', name: 'Infectious Disease Control Study', description: 'Study on controlling infectious diseases.' },
    { id: 'P010', name: 'Nutrition and Wellness Program', description: 'Program promoting nutrition and overall wellness.' },
  ];

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProject = (id) => {
    navigate(`/labeling-interface`);
  };

  const handleEditProject = (id) => {
    navigate(`/admin-project-page`);
  };

  const handleAddProject = () => {
    // Navigate to or open project creation interface
    navigate(`/admin-project-page`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="top-bar">
        <h1>Admin Dashboard</h1>
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="alogout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="Log out" style={{ width: '20px', height: '20px' }} />
          Log Out
        </button>
      </div>
      <p>All Projects</p>
      <div className="project-grid">
        {/* Add Project Card */}
        <div className="project-card add-project-card" onClick={handleAddProject}>
          <div className="add-project-icon">+</div>
          <p>Create New Project</p>
        </div>
        {filteredProjects.map((project) => (
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
