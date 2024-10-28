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

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, uploader, projectId, patientId } = req.body;
    const { filename, path: filepath } = req.file;

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

    res.send('Image uploaded successfully');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});

// Retrieve images for a specific person within a project
router.get('/images/:projectId/:patientId', (req, res) => {
  const { projectId, patientId } = req.params;
  const personDirectory = path.join(__dirname, '../projects', projectId, patientId);
  console.log('Scanning directory:', personDirectory);

  fs.readdir(personDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: `Unable to scan files for ${patientId}` });
    }
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'));
    res.json(imageFiles);
  });
});

module.exports = router;