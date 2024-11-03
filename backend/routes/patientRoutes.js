const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Route to create a new patient within a specific project, with image uploads
router.post('/:projectId/patients', patientController.createPatient);

// Route to get a specific patient by ID within a project
router.get('/:projectId/patients/:patientId', patientController.getPatientById);

// Route to get all patients within a specific project
router.get('/:projectId/patients', patientController.getPatientsFromProjectId);

// Route to update a patient by ID within a project, with image uploads
router.put('/:projectId/patients/:patientId', patientController.updatePatientById);

// Route to delete a patient by ID within a project
router.delete('/:projectId/patients/:patientId', patientController.deletePatientById);

module.exports = router;