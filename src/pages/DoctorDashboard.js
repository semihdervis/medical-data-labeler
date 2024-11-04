import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/get');
        setProjects(response.data);
      } catch (error) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleViewProject = (id) => {
    navigate(`/labeling-interface/${id}`);
  };

  return (
    <div className="doctor-dashboard">
      <div className="top-bar">
        <button className="logout-button" onClick={() => navigate('/')}>Log Out</button>
        <h1>Doctor Dashboard</h1>
      </div>
      <p>Assigned Projects</p>
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button className="view-button" onClick={() => handleViewProject(project._id)}>View Project</button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default DoctorDashboard;