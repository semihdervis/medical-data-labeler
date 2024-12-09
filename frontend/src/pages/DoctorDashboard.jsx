import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutIcon from "./icons/logout.png";
import axios from 'axios'

function DoctorDashboard () {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token') // Retrieve the token from local storage

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/projects/get',
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

  const handleLogout = () => {
    navigate('/')
  }

  const handleViewProject = id => {
    navigate(`/label`)
  }

  return (
    <div className="relative text-center px-5 bg-gray-100 min-h-screen mt-10">
      <div className="fixed top-2 left-2 right-2 bg-white rounded-lg shadow-md flex items-center justify-between px-4 py-3 z-50">
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
      <p className="mt-20 mb-5 text-lg font-medium text-gray-700">
        Assigned Projects
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id || index}
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
