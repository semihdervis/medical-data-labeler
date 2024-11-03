// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Refresh fields manually
router.get('/refresh-fields', userController.refreshFields);

module.exports = router;