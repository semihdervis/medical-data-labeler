import React, { useState } from 'react';
import axios from 'axios';
import './PatientForm.css';

const PatientForm = ({ onAddPatient }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patientData = {
            name,
            age,
            gender,
            contactNumber,
            address,
            medicalHistory: medicalHistory.split(',').map(item => item.trim()), // Convert to array
        };

        try {
            const response = await axios.post('/api/patients', patientData); // Update the URL as needed
            onAddPatient(response.data); // Notify parent component about the new patient
            // Clear form fields after successful submission
            setName('');
            setAge('');
            setGender('');
            setContactNumber('');
            setAddress('');
            setMedicalHistory('');
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    return (
        <form className="patient-form" onSubmit={handleSubmit}>
            <h2>Add New Patient</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="text" placeholder="Medical History (comma-separated)" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
            <button type="submit">Add Patient</button>
        </form>
    );
};

export default PatientForm;
