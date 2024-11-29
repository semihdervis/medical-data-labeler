const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

// Routes for patient management
router.post('/', patientController.addPatient);
router.get('/namelist', patientController.getPatientsList);
router.get('/:id/:patientId', patientController.getPatientById); // Specific route should come before the general route
router.get('/:id', patientController.getAllPatients); // General route
router.put('/:id/:patientId', patientController.updatePatient); // Update route with both projectId and patientId
router.delete('/:id/:patientId', patientController.deletePatient); // Delete route with both projectId and patientId

module.exports = router;