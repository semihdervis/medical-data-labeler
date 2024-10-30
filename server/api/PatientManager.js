const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('../services/PatientService');

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

// Route to add a new patient
router.post('/', async (req, res) => {
  try {
    const { projectId, name, age, gender } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Valid Project ID is required' });
    }

    console.log('Adding patient:', { projectId, name, age, gender }); // Debugging line

    // Call the addPatient function from the service
    const newPatient = await addPatient({ projectId, name, age, gender });

    // Create folder for the new patient
    createFolder(projectId, newPatient._id);

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding patient:', error); // Debugging line
    res.status(500).json({ message: error.message });
  }
});

// Route to get all patients
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const patients = await getAllPatients(projectId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a patient by ID
router.put('/:id', async (req, res) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a patient by ID
router.delete('/:id', async (req, res) => {
  try {
    const patient = await deletePatient(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;