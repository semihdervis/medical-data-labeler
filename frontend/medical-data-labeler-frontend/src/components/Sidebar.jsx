import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project._id}>
            <Link
              to={`/projects/${project._id}`}
              className="block hover:bg-gray-700 p-2 rounded"
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/add-project"
        className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Add Project
      </Link>
    </div>
  );
};

export default Sidebar;