const mongoose = require('mongoose');

// Define the Patient model
const Patient = require('../models/PatientModel');

// Function to add a new patient
async function addPatient(patientData) {
    const patient = new Patient(patientData);
    try {
        await patient.save();
        return patient;
    } catch (error) {
        throw new Error('Error adding patient: ' + error.message);
    }
}

// Function to get all patients
async function getAllPatients() {
    try {
        const patients = await Patient.find();
        return patients;
    } catch (error) {
        throw new Error('Error fetching patients: ' + error.message);
    }
}

// Function to get a patient by ID
async function getPatientById(patientId) {
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    } catch (error) {
        throw new Error('Error fetching patient: ' + error.message);
    }
}

// Function to update a patient by ID
async function updatePatient(patientId, updateData) {
    try {
        const patient = await Patient.findByIdAndUpdate(patientId, updateData, { new: true });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    } catch (error) {
        throw new Error('Error updating patient: ' + error.message);
    }
}

// Function to delete a patient by ID
async function deletePatient(patientId) {
    try {
        const patient = await Patient.findByIdAndDelete(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    } catch (error) {
        throw new Error('Error deleting patient: ' + error.message);
    }
}

module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
};