import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectManager.css'; // Import the CSS file for styling

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects/get');
            setProjects(response.data);
        } catch (err) {
            setError('Failed to fetch projects');
        }
    };

    const addProject = async () => {
        if (!newProjectName) return;

        try {
            const response = await axios.post('/api/projects/add', { name: newProjectName });
            setProjects((prev) => [...prev, response.data]);
            setNewProjectName('');
        } catch (error) {
            setError('Failed to add project');
        }
    };

    const deleteProject = async (id) => {
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects((prev) => prev.filter((project) => project._id !== id));
        } catch (error) {
            setError('Failed to delete project');
        }
    };

    const syncProjects = async () => {
        try {
            const response = await axios.get('/api/projects/sync');
            setProjects(response.data);
        } catch (error) {
            setError('Failed to sync projects');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="project-manager">
            <h2>Projects</h2>
            <div>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="New project name"
                />
                <button onClick={addProject}>Add Project</button>
                <button className="sync-button" onClick={syncProjects}>Sync Projects</button>
            </div>
            {error && <p className="error">{error}</p>}
            <ul>
                {projects.map((project) => (
                    <li key={project._id}>
                        {project.name}
                        <button onClick={() => deleteProject(project._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectManager;
