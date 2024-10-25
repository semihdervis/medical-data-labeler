const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Assuming you have a Project model defined

const dotenv  = require('dotenv');
const uri = process.env.MONGODB_URI;

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create a new project
router.post('/projects', async (req, res) => {
  const { name } = req.body;
  const newProject = new Project({ name });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project' });
  }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Project.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting project' });
  }
});

module.exports = router;