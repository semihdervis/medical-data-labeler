import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutIcon from "./icons/logout.png";
import axios from 'axios'

function AdminDashboard() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token') // Retrieve the token from local storage

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          '/api/projects/get',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setProjects(response.data)
      } catch (error) {
        setError('Failed to fetch projects')
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
  }, [token])

  // Filter projects based on the search term
  const filteredProjects = projects.filter(
    project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewProject = id => {
    navigate(`/label/${id}`)
  }

  const handleEditProject = id => {
    navigate(`/edit/${id}`)
    // print console to id
    console.log(id)
  }

  const handleAddProject = () => {
    // Navigate to or open project creation interface
    navigate(`/create`)
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="relative text-center px-5 bg-gray-100 min-h-screen flex flex-col">
      <div className="sticky top-2 left-2 right-2 bg-white rounded-lg shadow-md flex items-center justify-between px-4 py-3 z-50">
        <h1 className="text-xl text-primary font-bold">Admin Dashboard</h1>
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 h-10 px-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-negative hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <img src={logoutIcon} alt="Log out" className="w-5 h-5 mr-1 mt-1" />
          Log Out
        </button>
      </div>
      <p className=" mb-5 mt-3 text-lg font-medium text-gray-600">
        All Projects
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Add Project Card */}
        <div
          className="flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-primary text-primary cursor-pointer hover:bg-blue-100 p-6 rounded-lg"
          onClick={handleAddProject}
        >
          <div className="text-5xl font-bold mb-2">+</div>
          <p className="font-semibold">Create New Project</p>
        </div>
        {filteredProjects.map((project, index) => (
          <div
            key={project.id || index}
            className="flex flex-col justify-between bg-white p-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <h3 className="text-lg text-primary font-bold mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewProject(project._id)}
                className="flex-1 bg-primary hover:bg-secondary text-white py-2 rounded-md transition"
              >
                View Project
              </button>
              <button
                onClick={() => {
                  console.log('Edit button clicked for project:', project); // Log the project
                  handleEditProject(project._id);
                }}
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
