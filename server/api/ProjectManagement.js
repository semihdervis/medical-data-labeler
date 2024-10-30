const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const Patient = require('../models/PatientModel');

// Directory where project folders are stored
const projectsDir = path.join(__dirname, '../projects');

// Get all projects
router.get('/get', async (req, res) => {
  try {
    const projects = await Project.find();
    console.log('Fetched projects:', projects); // Debugging line
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new project
router.post('/add', async (req, res) => {
  const project = new Project({
    name: req.body.name,
  });

  try {
    const newProject = await project.save();

    // Create project folder and config.json
    const projectDir = path.join(projectsDir, newProject._id.toString());
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, 'config.json'), JSON.stringify({ name: newProject.name }, null, 2));

    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
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
});


router.get('/getPatients/:id', async (req, res) => {
  try {
    const patients = await Patient.find({ projectId: req.params.id });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
);


router.get('/sync', async (req, res) => {
  try {
    const projects = await Project.find();
    console.log('Fetched projects:', projects); // Debugging line

    // Create directories for projects and patients based on the database entries
    for (const project of projects) {
      const projectDir = path.join(projectsDir, project._id.toString());
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
        console.log(`Created project directory: ${projectDir}`);
      }

      const patients = await Patient.find({ projectId: project._id });
      for (const patient of patients) {
        const patientDir = path.join(projectDir, patient._id.toString());
        if (!fs.existsSync(patientDir)) {
          fs.mkdirSync(patientDir, { recursive: true });
          console.log(`Created patient directory: ${patientDir}`);
        }
      }
    }

    // Delete directories that are not present in the database
    const projectFolders = fs.readdirSync(projectsDir);
    for (const folder of projectFolders) {
      const projectDir = path.join(projectsDir, folder);
      const projectExists = projects.some(project => project._id.toString() === folder);

      if (!projectExists) {
        fs.rmSync(projectDir, { recursive: true });
        console.log(`Deleted project directory: ${projectDir}`);
      } else {
        const patients = await Patient.find({ projectId: folder });
        const patientFolders = fs.readdirSync(projectDir);
        for (const patientFolder of patientFolders) {
          const patientDir = path.join(projectDir, patientFolder);
          const patientExists = patients.some(patient => patient._id.toString() === patientFolder);

          if (!patientExists) {
            fs.rmSync(patientDir, { recursive: true });
            console.log(`Deleted patient directory: ${patientDir}`);
          }
        }
      }
    }

    res.json(projects); // Ensure response is an array of projects

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;