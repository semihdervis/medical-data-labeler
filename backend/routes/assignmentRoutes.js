const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

// Create a new assignment
router.post('/', assignmentController.createAssignment);

// Get all assignments
router.get('/', assignmentController.getAllAssignments);

// Get a specific assignment by ID
router.get('/:id', assignmentController.getAssignmentById);

// Update the status of an assignment
router.put('/:id/status', assignmentController.updateAssignmentStatus);

// Delete an assignment
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;