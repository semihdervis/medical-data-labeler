const express = require('express');
const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

// Route to create a new assignment within a specific project
router.post('/:projectId/assignments', assignmentController.createAssignment);

// Route to delete an assignment by ID within a specific project
router.delete('/:projectId/assignments/:assignmentId', assignmentController.deleteAssignment);

// Route to get all assignments within a specific project
router.get('/:projectId/assignments', assignmentController.getAssignmentsFromProjectId);

// Route to join a project using an invite code
router.post('/assignments/join', assignmentController.joinProjectWithInviteCode);

// Route to approve an assignment by ID
router.patch('/assignments/:assignmentId/approve', assignmentController.approveAssignment);

module.exports = router;