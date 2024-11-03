const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImageModel = require('../models/ImageModel');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectId, patientId } = req.body;

    // Ensure projectId and patientId are provided
    if (!projectId || !patientId) {
      return cb(new Error('Project ID and Patient ID are required'));
    }

    // Define the upload directory based on project and patient IDs
    const uploadDir = path.join(__dirname, '../projects', projectId, patientId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route to get images by projectId and patientId
router.get('/:projectId/:patientId', async (req, res) => {
  try {
    const { projectId, patientId } = req.params;
    const images = await ImageModel.find({ projectId, patientId });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to upload an image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, uploader, projectId, patientId } = req.body;
    const { filename, path: tempFilepath } = req.file;

    console.log('Received image upload:', { name, uploader, projectId, patientId, filename, tempFilepath });

    // Check if the required fields are present
    if (!name || !uploader || !projectId || !patientId || !filename) {
      console.error('Missing required fields in upload request');
      return res.status(400).json({ message: 'Missing required fields in upload request' });
    }

    // Create a temporary image entry in the database with the initial filepath
    const initialFilepath = path.join('projects', projectId, patientId, filename).replace(/\\/g, '/');
    const newImage = new ImageModel({ name, filepath: initialFilepath, uploader, projectId, patientId });
    await newImage.save();

    // Rename the file using the MongoDB ID to avoid filename conflicts
    const newFilename = `${newImage._id}${path.extname(filename)}`;
    const newFilepath = path.join(path.dirname(tempFilepath), newFilename);
    fs.renameSync(tempFilepath, newFilepath);

    // Update the image entry with the final filepath
    newImage.filepath = path.join('projects', projectId, patientId, newFilename).replace(/\\/g, '/');
    await newImage.save();

    console.log('Image uploaded and filepath updated successfully:', newImage);
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

module.exports = router;
