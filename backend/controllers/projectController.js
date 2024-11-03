const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');

// Define the folder path for storing project folders
const projectsFolderPath = path.join(__dirname, '..', 'projects');

// Helper function to create project folder
const createProjectFolder = (projectId) => {
  const projectFolderPath = path.join(projectsFolderPath, projectId.toString());
  if (!fs.existsSync(projectFolderPath)) {
    fs.mkdirSync(projectFolderPath, { recursive: true });
  }
};

// Helper function to delete project folder
const deleteProjectFolder = (projectId) => {
  const projectFolderPath = path.join(projectsFolderPath, projectId.toString());
  if (fs.existsSync(projectFolderPath)) {
    fs.rmSync(projectFolderPath, { recursive: true });
  }
};

// Helper function to generate a 5-character invite code
function generateInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Helper function to generate a 5-character unique invite code
async function generateUniqueInviteCode() {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = generateInviteCode();
    const existingProject = await Project.findOne({ invite_code: code });
    if (!existingProject) {
      isUnique = true;
    }
  }
  return code;
}

// Create Project
async function createProject(req, res) {
  try {
    const { name, description, labels } = req.body;

    // Generate a unique invite code for the project
    const invite_code = await generateUniqueInviteCode();

    // Create project in the database with the generated invite code
    const project = await Project.create({ name, description, labels, invite_code });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
}

// Get All Projects
async function getAllProjects(req, res) {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
}

// Get a Project By Id
async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
}

// Update a Project By Id
async function updateProjectById(req, res) {
  try {
    const { id } = req.params;
    const { name, description, labels } = req.body;

    // Find the existing project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update basic details
    if (name) project.name = name;
    if (description) project.description = description;

    // Helper function to handle label updates
    function updateLabels(existingLabels, newLabels) {
      const updatedLabels = [];
      const newLabelsMap = newLabels.reduce((map, label) => {
        if (label._id) map[label._id] = label;
        return map;
      }, {});

      // Update existing labels or mark them for deletion if they aren't in the new request
      existingLabels.forEach(label => {
        if (newLabelsMap[label._id]) {
          // Update fields
          const updatedLabel = newLabelsMap[label._id];
          label.label_name = updatedLabel.label_name;
          label.label_question = updatedLabel.label_question;
          label.input_type = updatedLabel.input_type;
          label.options = updatedLabel.options || label.options;

          updatedLabels.push(label);
        }
        // If not in newLabelsMap, it will be removed
      });

      // Add any new labels that don't have an _id
      newLabels.forEach(newLabel => {
        if (!newLabel._id) {
          updatedLabels.push(newLabel); // Push new label (MongoDB will assign an _id)
        }
      });

      return updatedLabels;
    }

    // Update person_labels and image_labels by preserving existing IDs and removing unmatched labels
    if (labels && labels.person_labels) {
      project.labels.person_labels = updateLabels(project.labels.person_labels, labels.person_labels);
    }
    if (labels && labels.image_labels) {
      project.labels.image_labels = updateLabels(project.labels.image_labels, labels.image_labels);
    }

    // Save the updated project
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
}

// Delete Project
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    // Delete project from the database
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete the project folder
    deleteProjectFolder(id);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProject
};