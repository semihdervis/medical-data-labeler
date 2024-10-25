const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    const projectsMap = {};
    projects.forEach(project => {
      projectsMap[project._id] = project;
    });
    res.json({ projects: projectsMap });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create a new project
router.post('/projects', async (req, res) => { // Changed route to '/projects'
  const { name, description, startDate, endDate, status } = req.body;
  const newProject = new Project({ name, description, startDate, endDate, status });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project' });
  }
});


// Delete a project
router.delete('/projects/:id', async (req, res) => { // Changed route to '/projects/:id'
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;