const Image = require('../models/ImageModel');
const LabelAnswer = require('../models/LabelAnswersModel');
const fs = require('fs');
const path = require('path');

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
    const newImage = new Image({ name, filepath: initialFilepath, uploader, projectId, patientId });
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

exports.uploadMultipleImages = async (req, res) => {
  try {
    const { uploader, projectId, patientId } = req.body;

    // Ensure all required fields are present
    if (!uploader || !projectId || !patientId || !req.files) {
      return res.status(400).json({ message: 'Missing required fields in upload request' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const { originalname, path: tempFilepath } = file;

      // Create a temporary image entry in the database
      const initialFilepath = path
        .join('projects', projectId, patientId, originalname)
        .replace(/\\/g, '/');
      const newImage = new Image({
        name: originalname,
        filepath: initialFilepath,
        uploader,
        projectId,
        patientId,
      });
      await newImage.save();

      // Rename the file using the MongoDB ID to avoid filename conflicts
      const newFilename = `${newImage._id}${path.extname(originalname)}`;
      const newFilepath = path.join(path.dirname(tempFilepath), newFilename);
      fs.renameSync(tempFilepath, newFilepath);

      // Update the image entry with the final filepath
      newImage.filepath = path
        .join('projects', projectId, patientId, newFilename)
        .replace(/\\/g, '/');
      await newImage.save();

      uploadedImages.push(newImage);
    }

    res.status(201).json({ message: 'Images uploaded successfully', uploadedImages });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};



exports.deleteImageById = async (imageId) => {
  try {
    const image = await Image.findById(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Delete the image's disk files
    const imagePath = path.join(__dirname, '../uploads', image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the image's label answers
    await LabelAnswer.deleteMany({ ownerId: image._id });

    // Delete the image itself
    await image.deleteOne();
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

exports.getImagesByProjectAndPatient = async (req, res) => {
  try {
    const { projectId, patientId } = req.params;
    const images = await Image.find({ projectId, patientId });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: error.message });
  }
};