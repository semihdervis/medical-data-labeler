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

    // Debugging statements
    console.log('projectId:', projectId);
    console.log('patientId:', patientId);

    if (!projectId || !patientId) {
      return cb(new Error('Project ID and Patient ID are required'));
    }

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

// Route to upload an image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, uploader, projectId, patientId } = req.body;
    const { filename, path: filepath } = req.file;

    console.log('Uploading image:', { name, uploader, projectId, patientId, filename, filepath });

    // Create a new image entry in the database
    const newImage = new ImageModel({ name, filepath, uploader, projectId, patientId });
    await newImage.save();

    // Rename the image file with the entry's ID
    const newFilename = `${newImage._id}${path.extname(filename)}`;
    const newFilepath = path.join(path.dirname(filepath), newFilename);
    fs.renameSync(filepath, newFilepath);

    // Update the image entry with the new file path
    newImage.filepath = newFilepath;
    await newImage.save();

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: err.message });
  }
  next();
});

module.exports = router;