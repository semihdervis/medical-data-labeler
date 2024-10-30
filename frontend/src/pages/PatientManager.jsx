import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientForm from './PatientForm';
import './PatientManager.css'; // Import the CSS file for styling

const PatientManager = () => {
    const [patients, setPatients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // New state for success message
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchPatients();
        }
    }, [selectedProject]);



    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects/get');
            setProjects(response.data);
        } catch (err) {
            setError('Failed to fetch projects');
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`/api/projects/getPatients/${selectedProject}`);
            setPatients(response.data);
        } catch (err) {
            setError('Failed to fetch patients');
            console.error('Error fetching patients:', err);
        }
    };

    const handlePatientAdded = (newPatient) => {
        setPatients((prev) => [...prev, newPatient]);
        setSuccessMessage('Patient added successfully!'); // Set success message
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
        setPatients([]); // Reset patients when project changes
    };

    return (
        <div>
            <h1>Patient Manager</h1>
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
                <>
                    <button onClick={() => {
                        console.log('Opening modal');
                        setIsModalOpen(true);
                    }}>Add Patient</button>
                    {isModalOpen && (
                        <PatientForm
                            projectId={selectedProject}
                            onPatientAdded={handlePatientAdded}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                    {successMessage && <p className="success">{successMessage}</p>}
                    {error && <p className="error">{error}</p>}
                    <ul>
                        {patients.map((patient) => (
                            <li key={patient._id}>{patient.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default PatientManager;