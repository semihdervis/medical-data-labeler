import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = ({ onProjectAdded }) => {
    const [projectName, setProjectName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/api/projects', { name: projectName });
        onProjectAdded(response.data);
        setProjectName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                required
            />
            <button type="submit">Add Project</button>
        </form>
    );
};

export default ProjectForm;
