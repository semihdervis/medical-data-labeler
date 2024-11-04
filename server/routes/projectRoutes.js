const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middlewares/authenticate');

// Get all projects
router.get('/get', authenticate, projectController.getAllProjects);

// Get project by ID
router.get('/:id', authenticate, projectController.getProjectById);

// Create a new project
router.post('/add', authenticate, projectController.createProject);

// Update a project
router.put('/:id', authenticate, projectController.updateProject);

// Delete a project
router.delete('/:id', authenticate, projectController.deleteProject);

module.exports = router;