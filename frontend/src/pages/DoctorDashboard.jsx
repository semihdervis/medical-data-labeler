import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutIcon from "./icons/logout.png";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    {
      id: "P001",
      name: "Respiratory Health Project",
      description: "Project focused on respiratory disease analysis.",
    },
    {
      id: "P002",
      name: "Cardiovascular Health Study",
      description: "Study on cardiovascular health conditions.",
    },
    {
      id: "P003",
      name: "Neurological Study Project",
      description: "Research on neurological health and disorders.",
    },
    {
      id: "P004",
      name: "Oncology Research Project",
      description: "Analysis of cancer and related diseases.",
    },
  ];

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => navigate("/");
  const handleViewProject = (id) => navigate(`/label`);

  return (
    <div className="relative text-center px-5 bg-gray-100  min-h-screen flex flex-col">
      <div className="sticky top-0 left-2 right-2 bg-white rounded-lg shadow-md flex items-center justify-between px-4 py-3 z-50">
        <h1 className="text-xl text-primary px-4 py-2 rounded-lg font-bold">
          Doctor Dashboard
        </h1>
      
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 h-10 px-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <img src={logoutIcon} alt="Log out" className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>
      <p className="mt-5 mb-5 text-lg font-medium text-gray-600">
        Assigned Projects
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between bg-white p-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <h3 className="text-lg text-primary font-bold mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <button
              onClick={() => handleViewProject(project.id)}
              className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md transition"
            >
              View Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;
