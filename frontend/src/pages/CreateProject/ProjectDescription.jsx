import React from "react";

function ProjectDescription({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
}) {
  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-lg">
      <h3 className="text-primary text-lg font-bold mb-4">
        Project Details
      </h3>
      <div className="mb-5">
        <label
          htmlFor="projectName"
          className="block text-gray-700 font-medium mb-2"
        >
          Project Name:
        </label>
        <textarea
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label
          htmlFor="projectDescription"
          className="block text-gray-700 font-medium mb-2"
        >
          Project Description:
        </label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows="3"
          placeholder="Enter project description"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
      </div>
    </section>
  );
}

export default ProjectDescription;
