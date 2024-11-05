import React from 'react';

function ProjectDescription({ projectDescription, setProjectDescription }) {
  return (
    <section className="section">
      <h3>Project Description</h3>
      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        rows="3"
      ></textarea>
    </section>
  );
}

export default ProjectDescription;
