const express = require('express');
const router = express.Router();
const labelHistoryController = require('../controllers/labelHistoryController');

// Submit a new label (person-level or image-level)
router.post('/', labelHistoryController.submitLabel);

// Get label history for a specific patient
router.get('/patient/:patient_id', labelHistoryController.getLabelHistoryByPatient);

// Get label history for a specific image
router.get('/image/:image_id', labelHistoryController.getLabelHistoryByImage);

// Delete a specific label entry by ID
router.delete('/:id', labelHistoryController.deleteLabelEntry);

module.exports = router;