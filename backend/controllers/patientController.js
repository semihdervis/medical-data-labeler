const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Project = require('../models/Project');
const Patient = require('../models/Patient');

// Define the base folder for storing project folders
const projectsFolderPath = path.join(__dirname, '..', 'projects');

// Configure Multer for image uploads
const storage = multer.memoryStorage(); // Use memory storage to access file buffer in code
const upload = multer({ storage });

// Helper function to create a folder if it doesn't exist
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create Patient
async function createPatient(req, res) {
  try {
    const { projectId } = req.params; // Get projectId from URL parameters
    const { name, metadata } = req.body;

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create the patient in the database
    const patient = await Patient.create({ name, metadata, project_id: projectId });

    // Create a folder for the patient under the project's folder
    const patientFolderPath = path.join('projects', projectId.toString(), patient._id.toString());
    createFolderIfNotExists(path.join(__dirname, '..', patientFolderPath));

    // Handle multiple image uploads with descriptions
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const description = req.body[`description_${i}`] || ''; // Retrieve description for the current image

        // Create a temporary image entry with a placeholder for image_url
        const imageEntry = { image_url: "placeholder", description: description };
        patient.images.push(imageEntry);
        await patient.save();

        // Get the image ID and set the actual file path (relative path)
        const imageId = patient.images[patient.images.length - 1]._id;
        const imagePath = path.join(patientFolderPath, `${imageId}.jpg`); // Relative path

        // Save the image file to the file system
        fs.writeFileSync(path.join(__dirname, '..', imagePath), file.buffer);

        // Update the image entry with the relative file path
        patient.images[patient.images.length - 1].image_url = imagePath;
      }

      // Save patient with updated image URLs
      await patient.save();
    }

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create patient', details: error.message });
  }
}

// Get all patients by project ID
async function getPatientsFromProjectId(req, res) {
  try {
    const { projectId } = req.params;
    const patients = await Patient.find({ project_id: projectId });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
  }
}

// Get a patient by ID
async function getPatientById(req, res) {
  try {
    const { projectId, patientId } = req.params;
    const patient = await Patient.findOne({ _id: patientId, project_id: projectId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found in this project' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
  }
}

async function updatePatientById(req, res) {
  try {
    const { projectId, patientId } = req.params;
    const { name, metadata, deleteImages } = req.body;

    const patient = await Patient.findOne({ _id: patientId, project_id: projectId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found in this project' });
    }

    // Update patient data if provided
    if (name) patient.name = name;
    if (metadata) patient.metadata = metadata;

    // Define the patient's folder path for new images
    const patientFolderPath = path.join('projects', projectId.toString(), patient._id.toString());
    const absolutePatientFolderPath = path.join(__dirname, '..', patientFolderPath);
    createFolderIfNotExists(absolutePatientFolderPath);

    // Handle adding new images if files are provided
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const description = req.body[`description_${i}`] || '';

        // Create a new image entry with a placeholder for image_url
        const imageEntry = { image_url: "placeholder", description: description };
        patient.images.push(imageEntry);
        await patient.save();

        // Get the image ID and set the actual file path (relative path)
        const imageId = patient.images[patient.images.length - 1]._id;
        const imagePath = path.join(patientFolderPath, `${imageId}.jpg`); // Relative path

        // Save the image file to the file system
        fs.writeFileSync(path.join(__dirname, '..', imagePath), file.buffer);

        // Update the image entry with the relative file path
        patient.images[patient.images.length - 1].image_url = imagePath;
      }
    }

    // Handle deleting images if `deleteImages` is provided (array of image IDs)
    if (deleteImages && Array.isArray(deleteImages)) {
      deleteImages.forEach(imageId => {
        const imageIndex = patient.images.findIndex(img => img._id.toString() === imageId);

        if (imageIndex !== -1) {
          const imagePath = path.join(__dirname, '..', patient.images[imageIndex].image_url);

          // Delete the image file from the file system if it exists
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }

          // Remove the image entry from the database
          patient.images.splice(imageIndex, 1);
        }
      });
    }

    // Save updates to the patient
    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient', details: error.message });
  }
}


// Delete a patient by ID
async function deletePatientById(req, res) {
  try {
    const { projectId, patientId } = req.params;

    const patient = await Patient.findOneAndDelete({ _id: patientId, project_id: projectId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found in this project' });
    }

    // Delete patient folder and all images within it
    const patientFolderPath = path.join(projectsFolderPath, projectId.toString(), patient._id.toString());
    if (fs.existsSync(patientFolderPath)) {
      fs.rmSync(patientFolderPath, { recursive: true });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete patient', details: error.message });
  }
}

module.exports = {
  createPatient: [upload.array('images'), createPatient],
  getPatientsFromProjectId,
  getPatientById,
  updatePatientById: [upload.array('images'), updatePatientById],
  deletePatientById
};