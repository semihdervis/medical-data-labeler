const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const User = require('./models/UserModel');
const helpers = require('./utils/helpers');
const authenticate = require('./middlewares/authenticate');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require('./routes/patientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/patients', patientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Authorization middleware for static files
const authorize = (req, res, next) => {
    const filePath = req.path;
    const projectId = path.basename(path.dirname(filePath));

    if (req.userRole === 'admin' || req.userProjects.includes(projectId)) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};

// Serve static files with authentication and authorization
app.use('/projects', authenticate, authorize, express.static('projects'));

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const REMOTE_URI = process.env.MONGODB_URI;

const isRemote = false;

const MONGODB_URI = isRemote ? REMOTE_URI : 'mongodb://localhost:27017/medical-labeler';

mongoose.connect(MONGODB_URI, {});

const connection = mongoose.connection;
connection.once('open', async () => {
  console.log('MongoDB connected:', MONGODB_URI);
  console.log("\n");

  const randomPassword = helpers.generateRandomString(10);
  console.log("Admin account password: " + randomPassword);

  // Create or update the admin account
  await createOrUpdateAdminAccount(randomPassword);
});

const createOrUpdateAdminAccount = async (password) => {
  try {
    const adminEmail = 'admin'; // Define the admin email
    
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      // Update the password if the admin account already exists
      admin.password = password;
      await admin.save();
      console.log('Admin account updated with new password.');
    } else {
      // Create a new admin account if it doesn't exist
      admin = new User({
        email: adminEmail,
        password: password,
        isAdmin: true,
      });
      await admin.save();
      console.log('Admin account created.');
    }
  } catch (error) {
    console.error('Error creating/updating admin account: ', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});