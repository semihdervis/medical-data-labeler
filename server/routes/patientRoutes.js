const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Routes for patient management
router.post('/', patientController.addPatient);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;