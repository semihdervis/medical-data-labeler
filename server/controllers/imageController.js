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

exports.uploadImages = async (projectId, patientId, images) => {
  try {
    const newImages = images.map((image) => ({
      name: image.name,
      uploader: image.uploader,
      projectId,
      patientId,
      filename: image.filename,
    }));

    const uploadedImages = await Image.insertMany(newImages);

    // handle renaming and moving the files
    for (const uploadedImage of uploadedImages) {
      const initialFilepath = path.join(__dirname, '../uploads', uploadedImage.filename);
      const newFilename = `${uploadedImage._id}${path.extname(uploadedImage.filename)}`;
      const newFilepath = path.join(__dirname, '../projects', projectId, patientId, newFilename);

      fs.renameSync(initialFilepath, newFilepath);
      uploadedImage.filename = newFilename;
      uploadedImage.filepath = path.join('projects', projectId, patientId, newFilename).replace(/\\/g, '');
      await uploadedImage.save();
    }


    return uploadedImages;
  } catch (error) {
    throw new Error(`Error uploading images: ${error.message}`);
  }
}

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