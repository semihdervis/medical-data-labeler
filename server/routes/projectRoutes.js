const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const authenticate = require('../middlewares/authenticate')
const checkAdmin = require('../middlewares/checkAdmin') // Import the checkAdmin middleware

// Get all projects
router.get('/get', authenticate, projectController.getAllProjects)

// Get project by ID
router.get('/:id', authenticate, projectController.getProjectById)

// Create a new project
router.post('/add', authenticate, projectController.createProject)

// Update a project
router.put('/:id', authenticate, projectController.updateProject)

// Delete a project
router.delete('/:id', authenticate, projectController.deleteProject)

// Assign a doctor to a project
router.post(
  '/:projectId/assign-doctor',
  authenticate,
  checkAdmin,
  projectController.assignDoctor
)

// Remove a doctor from a project
router.post(
  '/:projectId/remove-doctor',
  authenticate,
  checkAdmin,
  projectController.removeDoctor
)

router.put(
  '/:projectId/update-assigns',
  authenticate,
  checkAdmin,
  projectController.updateAssigns
)

module.exports = router
