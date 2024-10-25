import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectsManagamentTest() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const createProject = async () => {
    try {
      const response = await axios.post('/api/projects', { name: newProjectName });
      setProjects([...projects, response.data]);
      setNewProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const removeProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error removing project:', error);
    }
  };

  return (
    <div>
      <h1>Projects Management</h1>
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="New Project Name"
      />
      <button onClick={createProject}>Create Project</button>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name}
            <button onClick={() => removeProject(project.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsManagamentTest;