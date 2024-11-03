const path = require('path');
const fs = require('fs');
const ImageModel = require('../models/ImageModel');

// Controller methods
exports.uploadImage = async (req, res) => {
  try {
    const { name, uploader, projectId, patientId } = req.body;
    const { filename, path: tempFilepath } = req.file;

    console.log('Uploading image:', { name, uploader, projectId, patientId, filename, tempFilepath });

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
};

exports.getImagesByProjectAndPatient = async (req, res) => {
  try {
    const { projectId, patientId } = req.params;
    const images = await ImageModel.find({ projectId, patientId });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: error.message });
  }
};