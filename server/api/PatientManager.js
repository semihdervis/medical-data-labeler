const express = require('express');
const router = express.Router();
const {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('../services/PatientService');

// Route to add a new patient
router.post('/', async (req, res) => {
  try {
    const patient = await addPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await getAllPatients();
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