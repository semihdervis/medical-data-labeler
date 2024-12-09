const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Patient = require('../models/PatientModel');
const Project = require('../models/ProjectModel');

// Function to create a folder for the patient
const createFolder = (projectId, patientId) => {
  const projectDir = path.join(__dirname, '../projects', projectId.toString());
  const patientDir = path.join(projectDir, patientId.toString());

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
    console.log(`Created project directory: ${projectDir}`);
  }

  if (!fs.existsSync(patientDir)) {
    fs.mkdirSync(patientDir, { recursive: true });
    console.log(`Created patient directory: ${patientDir}`);
  }
};

// Controller methods
exports.addPatient = async (req, res) => {
  try {
    const { projectId, name, age, gender } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Valid Project ID is required' });
    }

    if (!name || !age || !gender) {
      return res.status(400).json({ message: 'All patient fields are required' });
    }

    const projectExists = await Project.findById(projectId);

    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newPatient = new Patient({ projectId, name, age, gender });
    await newPatient.save();

    // Create folder for the new patient
    createFolder(projectId, newPatient._id);

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: error.message });
  }
};

// get a list of patients only consisting of their names and ids


// Get list of patient names
exports.getPatientsList = async (req, res) => {
  try {
    const patients = await Patient.find({}, 'name'); // Only select the 'name' field
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllPatients = async (req, res) => {
  const { id } = req.params; // Access the project ID from the URL parameters
  try {
    const patients = await Patient.find({ projectId: id });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  const { id, patientId } = req.params; // Access the project ID and patient ID from the URL parameters
  try {
    const patient = await Patient.findOne({ _id: patientId, projectId: id }); // Search by both projectId and patientId
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  const { id, patientId } = req.params; // Access the project ID and patient ID from the URL parameters
  const updateData = req.body; // Extract update data from the request body
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, projectId: id },
      updateData,
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a patient and their folder
// Example request: DELETE /patients/123
exports.deletePatient = async (req, res) => {
  try {
    const { id, patientId } = req.params; // Access the project ID and patient ID from the URL parameters
    const deletedPatient = await Patient.findOneAndDelete({ _id: patientId, projectId: id });
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete the patient's folder
    const projectDir = path.join(__dirname, '../projects', id.toString());
    const patientDir = path.join(projectDir, patientId.toString());
    fs.rmSync(patientDir, { recursive: true });

    // Delete the patient's label answers
    await LabelAnswer.deleteOne({ ownerId: id, patientId });

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: error.message });
  }
};