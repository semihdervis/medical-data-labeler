const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageController = require('../controllers/imageController');
const authenticate = require('../middlewares/authenticate');
const checkAdmin = require('../middlewares/checkAdmin');

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

// Routes for image management
router.post('/upload', upload.single('image'), authenticate, checkAdmin, imageController.uploadImage);
router.post(
  '/upload-multiple',
  upload.array('images', 10), // Allows up to 10 files in one request
  authenticate,
  checkAdmin,
  imageController.uploadMultipleImages
);

router.get('/:projectId/:patientId', authenticate, checkAdmin, imageController.getImagesByProjectAndPatient);
router.delete('/:projectId/:patientId/:imageId', authenticate, checkAdmin, imageController.deleteImageWithRequest);
module.exports = router;