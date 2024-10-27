import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectsManagementTest.css'; // Import the CSS file

const ProjectsManagementTest = () => {
  const [projects, setProjects] = useState([]); // Ensure initial state is an array
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/get');
        console.log('Fetched projects:', response.data); // Debugging line
        if (Array.isArray(response.data)) {
          setProjects(response.data); // Ensure response data is an array
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching projects:', error); // Debugging line
        setError('Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  const addProject = async () => {
    try {
      const response = await axios.post('/api/projects/add', { name: newProjectName });
      setProjects([...projects, response.data]);
      setNewProjectName('');
    } catch (error) {
      setError('Error creating project');
    }
  };

  const removeProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      setError('Error removing project');
    }
  };

  return (
    <div className="container">
      <h1>Projects Management</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="Enter project name"
      />
      <button onClick={addProject}>Add Project</button>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            {project.name}
            <button onClick={() => removeProject(project._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsManagementTest;