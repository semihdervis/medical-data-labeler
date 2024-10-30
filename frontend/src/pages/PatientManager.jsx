import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientForm from './PatientForm';
import './PatientManager.css'; // Import the CSS file for styling

const PatientManager = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // New state for success message
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/api/patients');
            setPatients(response.data);
        } catch (err) {
            setError('Failed to fetch patients');
        }
    };

    const handlePatientAdded = (newPatient) => {
        setPatients((prev) => [...prev, newPatient]);
        setSuccessMessage('Patient added successfully!'); // Set success message
        setIsModalOpen(false); // Close the modal after adding
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const handleDeletePatient = async (id) => {
        try {
            await axios.delete(`/api/patients/${id}`);
            setPatients((prev) => prev.filter((patient) => patient._id !== id));
        } catch (error) {
            setError('Failed to delete patient');
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="patient-manager">
            <h2>Patients</h2>
            <button onClick={() => setIsModalOpen(true)}>Add Patient</button>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>} {/* Success message display */}
            <ul>
                {patients.map((patient) => (
                    <li key={patient._id}>
                        {patient.name} - {patient.age} years old
                        <button onClick={() => handleDeletePatient(patient._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <PatientForm onPatientAdded={handlePatientAdded} />
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientManager;
