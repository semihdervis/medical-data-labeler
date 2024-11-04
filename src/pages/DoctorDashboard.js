import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';
import logoutIcon from './icons/logout.png';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    { id: 'P001', name: 'Respiratory Health Project', description: 'Project focused on respiratory disease analysis.' },
    { id: 'P002', name: 'Cardiovascular Health Study', description: 'Study on cardiovascular health conditions.' },
    { id: 'P003', name: 'Neurological Study Project', description: 'Research on neurological health and disorders.' },
    { id: 'P004', name: 'Oncology Research Project', description: 'Analysis of cancer and related diseases.' },
  ];

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    navigate('/');
  };

  const handleViewProject = (id) => {
    navigate(`/labeling-interface`);
  };

  return (
    <div className="doctor-dashboard">
      <div className="top-bar">
        
        <h1>Doctor Dashboard</h1>
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="dlogout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="Log out" style={{ width: '20px', height: '20px' }} />
          Log Out
        </button>
      </div>
      <p>Assigned Projects</p>
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button className="dview-button" onClick={() => handleViewProject(project.id)}>View Project</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;
