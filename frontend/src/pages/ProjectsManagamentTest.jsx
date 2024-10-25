import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectsManagamentTest() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      const projectsMap = response.data.projects;
      const projectsArray = Object.values(projectsMap); // Convert map to array
      setProjects(projectsArray);
    } catch (error) {
      setError('Error fetching projects');
    }
  };

  const createProject = async () => {
    try {
      const response = await axios.post('/api/projects', { name: newProjectName });
      setProjects([...projects, response.data]);
      setNewProjectName('');
    } catch (error) {
      setError('Error creating project');
    }
  };

  const removeProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${_id}`);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      setError('Error removing project');
    }
  };

  return (
    <div>
      <h1>Projects Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="New Project Name"
      />
      <button onClick={createProject}>Create Project</button>
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
}

export default ProjectsManagamentTest;