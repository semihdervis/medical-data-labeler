import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoutIcon from './icons/logout.png';

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    { id: 'P001', name: 'Respiratory Health Project', description: 'Project focused on respiratory disease analysis.' },
    { id: 'P002', name: 'Cardiovascular Health Study', description: 'Study on cardiovascular health conditions.' },
    { id: 'P003', name: 'Neurological Study Project', description: 'Research on neurological health and disorders.' },
    { id: 'P004', name: 'Oncology Research Project', description: 'Analysis of cancer and related diseases.' },
    { id: 'P009', name: 'Infectious Disease Control Study', description: 'Study on controlling infectious diseases.' },
    { id: 'P010', name: 'Nutrition and Wellness Program', description: 'Program promoting nutrition and overall wellness.' },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProject = (id) => navigate(`/label`);
  const handleEditProject = (id) => navigate(`/admin-project-page`);
  const handleAddProject = () => navigate(`/admin-project-page`);
  const handleLogout = () => navigate('/');

  return (
    <div className="relative text-center mt-12 p-5 bg-gray-100 min-h-screen">
      <div className="fixed top-2 left-2 right-2 bg-white rounded-lg shadow-md flex items-center justify-between px-4 py-3 z-50">
        <h1 className="text-xl text-blue-700 font-bold">Admin Dashboard</h1>
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
      <p className="mt-20 mb-5 text-lg font-medium text-gray-700">All Projects</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Add Project Card */}
        <div
          className="flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-100 p-6 rounded-lg"
          onClick={handleAddProject}
        >
          <div className="text-5xl font-bold mb-2">+</div>
          <p className="font-semibold">Create New Project</p>
        </div>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between bg-white p-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <h3 className="text-lg text-blue-700 font-bold mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewProject(project.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md transition"
              >
                View Project
              </button>
              <button
                onClick={() => handleEditProject(project.id)}
                className="flex-1 bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md transition"
              >
                Edit Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
