import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const [project, setProject] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const addPersonLabel = () => {
    setProject({
      ...project,
      labels: {
        ...project.labels,
        person_labels: [
          ...project.labels.person_labels,
          { label_question: '', input_type: 'text', options: [] }
        ]
      }
    });
  };

  const addImageLabel = () => {
    setProject({
      ...project,
      labels: {
        ...project.labels,
        image_labels: [
          ...project.labels.image_labels,
          { label_question: '', input_type: 'text' }
        ]
      }
    });
  };

  const deletePersonLabel = (index) => {
    const updatedLabels = project.labels.person_labels.filter((_, i) => i !== index);
    setProject({
      ...project,
      labels: {
        ...project.labels,
        person_labels: updatedLabels
      }
    });
  };

  const deleteImageLabel = (index) => {
    const updatedLabels = project.labels.image_labels.filter((_, i) => i !== index);
    setProject({
      ...project,
      labels: {
        ...project.labels,
        image_labels: updatedLabels
      }
    });
  };

  const handleLabelChange = (type, index, field, value) => {
    const updatedProject = { ...project };
    updatedProject.labels[type][index] = {
      ...updatedProject.labels[type][index],
      [field]: value
    };
    setProject(updatedProject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/projects/${id}`, project);
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={project.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Person Labels</h3>
          {project.labels.person_labels.map((label, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <div className="flex justify-between mb-2">
                <input
                  type="text"
                  value={label.label_question}
                  onChange={(e) => handleLabelChange('person_labels', index, 'label_question', e.target.value)}
                  className="flex-grow px-3 py-2 border rounded mr-2"
                  placeholder="Label question"
                />
                <button
                  type="button"
                  onClick={() => deletePersonLabel(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <select
                value={label.input_type}
                onChange={(e) => handleLabelChange('person_labels', index, 'input_type', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addPersonLabel}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Person Label
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Image Labels</h3>
          {project.labels.image_labels.map((label, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <div className="flex justify-between mb-2">
                <input
                  type="text"
                  value={label.label_question}
                  onChange={(e) => handleLabelChange('image_labels', index, 'label_question', e.target.value)}
                  className="flex-grow px-3 py-2 border rounded mr-2"
                  placeholder="Label question"
                />
                <button
                  type="button"
                  onClick={() => deleteImageLabel(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <select
                value={label.input_type}
                onChange={(e) => handleLabelChange('image_labels', index, 'input_type', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageLabel}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Image Label
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;