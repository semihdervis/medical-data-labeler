import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageManager = () => {
    const [image, setImage] = useState(null);
    const [uploader, setUploader] = useState('');
    const [description, setDescription] = useState(''); // New state for description
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const backendUrl = 'http://localhost:3001';
    useEffect(() => {
        // Fetch projects
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects/get');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            // Fetch patients for the selected project
            const fetchPatients = async () => {
                try {
                    const response = await axios.get(`/api/projects/getPatients/${selectedProject}`);
                    setPatients(response.data);
                } catch (error) {
                    console.error('Error fetching patients:', error);
                }
            };

            fetchPatients();
        }
    }, [selectedProject]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
        setSelectedPatient(''); // Reset selected patient when project changes
        setUploadedImages([]); // Reset uploaded images when project changes
    };

    const handlePatientChange = (e) => {
        setSelectedPatient(e.target.value);
        fetchImages(e.target.value); // Fetch images for the selected patient
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', image.name);
        formData.append('uploader', uploader);
        formData.append('description', description); // Append description
        formData.append('projectId', selectedProject);
        formData.append('patientId', selectedPatient);
        formData.append('image', image); // Append the image last

        try {
            const response = await axios.post('/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully:', response.data);
            // Fetch the updated list of images for the selected patient
            fetchImages(selectedPatient);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const fetchImages = async (patientId) => {
        try {
            const response = await axios.get(`/api/images/${selectedProject}/${patientId}`);
            setUploadedImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    return (
        <div>
            <h1>Image Manager</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Project:</label>
                    <select value={selectedProject} onChange={handleProjectChange}>
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedProject && (
                    <div>
                        <label>Select Patient:</label>
                        <select value={selectedPatient} onChange={handlePatientChange}>
                            <option value="">Select a patient</option>
                            {patients.map((patient) => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label>Uploader:</label>
                    <input
                        type="text"
                        value={uploader}
                        onChange={(e) => setUploader(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label> {/* New input field for description */}
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input type="file" onChange={handleImageChange} required />
                </div>
                <button type="submit">Upload Image</button>
            </form>
            {selectedPatient && (
                <>
                    <h2>Uploaded Images</h2>
                    <ul>
                        {uploadedImages.map((image) => (
                            <li key={image._id}>
                                <img src={`${backendUrl}/${image.filepath}`} alt={image.name} width="100" />
                                <p>{image.name}</p>
                                <p>{image.description}</p> {/* Display image description */}
                            </li>
                        ))}
                    </ul>

                </>
            )}
        </div>
    );
};

export default ImageManager;