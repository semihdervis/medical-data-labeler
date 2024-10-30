import React, { useState } from 'react';
import axios from 'axios';
import './PatientForm.css';

const PatientForm = ({ projectId, onPatientAdded, onClose }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPatient = {
            name,
            age,
            gender,
            projectId,
        };

        console.log('Submitting new patient:', newPatient); // Debugging line

        try {
            const response = await axios.post('/api/patients', newPatient);
            console.log('Patient added successfully:', response.data); // Debugging line
            onPatientAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to add patient:', error.response ? error.response.data : error.message); // Debugging line
            setError('Failed to add patient');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Patient</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Age:</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit">Add Patient</button>
                </form>
            </div>
        </div>
    );
};

export default PatientForm;