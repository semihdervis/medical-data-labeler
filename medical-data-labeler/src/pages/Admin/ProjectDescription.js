import React from 'react';

function ProjectDescription({ projectName, setProjectName, projectDescription, setProjectDescription }) {
  return (
    <section className="section">
      <h3>Project Details</h3>
      <div className="project-name">
        <label htmlFor="projectName">Project Name:</label>
        <textarea
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </div>
      <div className="project-description">
        <label htmlFor="projectDescription">Project Description:</label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows="3"
          placeholder="Enter project description"
        ></textarea>
      </div>
    </section>
  );
}

export default ProjectDescription;
