// controllers/projectController.js

const path = require('path');
const fs = require('fs');
const Project = require('../models/ProjectModel');
const Patient = require('../models/PatientModel');

const projectsDir = path.join(__dirname, '../projects');

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

exports.addProject = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        const newProject = new Project({ name });
        await newProject.save();
        const projectDir = path.join(projectsDir, newProject._id.toString());
        fs.mkdirSync(projectDir);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();

    // Remove project folder
    const projectDir = path.join(projectsDir, req.params.id);
    fs.rmSync(projectDir, { recursive: true });

    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientsByProjectId = async (req, res) => {
  try {
    const patients = await Patient.find({ projectId: req.params.id });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};