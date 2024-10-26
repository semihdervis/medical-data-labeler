const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get all users (Admin only)
router.get('/', userController.getAllUsers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Delete a user by ID (Admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;