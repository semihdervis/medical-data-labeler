import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personLabels, setPersonLabels] = useState([]);
  const [imageLabels, setImageLabels] = useState([]);
  const navigate = useNavigate();

  const addPersonLabel = () => {
    setPersonLabels([...personLabels, { label_question: '', input_type: 'text', options: [] }]);
  };

  const addImageLabel = () => {
    setImageLabels([...imageLabels, { label_question: '', input_type: 'text' }]);
  };

  const updatePersonLabel = (index, field, value) => {
    const updatedLabels = [...personLabels];
    updatedLabels[index][field] = value;
    setPersonLabels(updatedLabels);
  };

  const updateImageLabel = (index, field, value) => {
    const updatedLabels = [...imageLabels];
    updatedLabels[index][field] = value;
    setImageLabels(updatedLabels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/projects', {
        name,
        description,
        labels: {
          person_labels: personLabels,
          image_labels: imageLabels
        }
      });
      console.log('Project created:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Project Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Person Labels</h3>
          {personLabels.map((label, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <input
                type="text"
                value={label.label_question}
                onChange={(e) => updatePersonLabel(index, 'label_question', e.target.value)}
                placeholder="Label question"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <select
                value={label.input_type}
                onChange={(e) => updatePersonLabel(index, 'input_type', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addPersonLabel} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Add Person Label
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Image Labels</h3>
          {imageLabels.map((label, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <input
                type="text"
                value={label.label_question}
                onChange={(e) => updateImageLabel(index, 'label_question', e.target.value)}
                placeholder="Label question"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <select
                value={label.input_type}
                onChange={(e) => updateImageLabel(index, 'input_type', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addImageLabel} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Add Image Label
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;