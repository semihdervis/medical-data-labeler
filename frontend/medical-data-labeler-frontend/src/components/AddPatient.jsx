import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPatient = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [patientData, setPatientData] = useState({
    name: '',
    metadata: {
      age: '',
      gender: '',
      medical_history: ''
    },
    project_id: projectId,
    images: []
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setPatientData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setPatientData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addImage = () => {
    setPatientData(prev => ({
      ...prev,
      images: [...prev.images, { image_url: '', description: '' }]
    }));
  };

  const removeImage = (index) => {
    setPatientData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index, field, value) => {
    setPatientData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/patients', patientData);
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Patient Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="metadata.age" className="block mb-1">Age</label>
          <input
            type="number"
            id="metadata.age"
            name="metadata.age"
            value={patientData.metadata.age}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="metadata.gender" className="block mb-1">Gender</label>
          <select
            id="metadata.gender"
            name="metadata.gender"
            value={patientData.metadata.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="metadata.medical_history" className="block mb-1">Medical History</label>
          <textarea
            id="metadata.medical_history"
            name="metadata.medical_history"
            value={patientData.metadata.medical_history}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
          ></textarea>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Images</h3>
            <button
              type="button"
              onClick={addImage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Image
            </button>
          </div>

          {patientData.images.map((image, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">Image {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  value={image.image_url}
                  onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={image.description}
                  onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows="2"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default AddPatient;