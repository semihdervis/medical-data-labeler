const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middlewares/authenticate');
const checkAdmin = require('../middlewares/checkAdmin'); // Import the checkAdmin middleware

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

// Routes for patient management
router.post('/', authenticate, checkAdmin, patientController.addPatient);
router.get('/namelist', authenticate, patientController.getPatientsList);
router.get('/:id/:patientId', authenticate, checkAdmin, patientController.getPatientById); // Specific route should come before the general route
router.get('/:id', authenticate, patientController.getAllPatients); // General route, may be restricted to admins only
router.put('/:id/:patientId', authenticate, checkAdmin, patientController.updatePatient); // Update route with both projectId and patientId
router.delete('/:id/:patientId', authenticate, checkAdmin, patientController.deletePatient); // Delete route with both projectId and patientId

module.exports = router;