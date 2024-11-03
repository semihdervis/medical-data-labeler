// routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Get all projects
router.get('/get', projectController.getAllProjects);

// add a project
router.post('/add', projectController.addProject);


// Delete a project
router.delete('/:id', projectController.deleteProject);

// Get patients by project ID
router.get('/getPatients/:id', projectController.getPatientsByProjectId);



module.exports = router;