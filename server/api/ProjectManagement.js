const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

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
    fs.rmdirSync(projectDir, { recursive: true });

    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sync projects from folders
/* router.get('/sync', async (req, res) => {
  try {
    const folders = fs.readdirSync(projectsDir);
    const syncedProjects = Project.find();

    for (const folder of folders) {
      const configPath = path.join(projectsDir, folder, 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        let project = await Project.findById(folder);

        if (!project) {
          console.log('Creating project:', config); // Debugging line
          project = new Project({ _id: folder, name: config.name });
          await project.save();
          syncedProjects.push(project);
          res.json(project);
        }
        else {
          console.log('Project already exists:', project); // Debugging line
        }
      }
    }

    res.json(syncedProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/


router.get('/sync', async (req, res) => {
  try {
    const projects = await Project.find();
    console.log('Fetched projects:', projects); // Debugging line

    const folders = fs.readdirSync(projectsDir);

    for (const folder of folders) {
      const configPath = path.join(projectsDir, folder, 'config.json');
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          let project = await Project.findById(folder);

          if (!project) {
            console.log('Creating project:', config); // Debugging line
            project = new Project({ _id: folder, name: config.name });
            await project.save();
            projects.push(project);
          } else {
            console.log('Project already exists:', project); // Debugging line
          }
        } catch (jsonError) {
          console.error(`Error parsing JSON for ${configPath}:`, jsonError); // Log JSON parsing error
        }
      }
    }

    res.json(projects); // Ensure response is an array of projects

  } catch (err) {
    console.error('Error syncing projects:', err); // Debugging line
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;