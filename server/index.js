const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectsRouter = require('./api/ProjectManagement');
const userManagerRouter = require('./api/UserManager');
const imageManagerRouter = require('./api/ImageManager');
const patientManagerRouter = require('./api/PatientManager');

const dotenv = require('dotenv');
dotenv.config();

const remote_uri = `${process.env.MONGODB_URI}/test`;

const app = express();
const PORT = 3001;

const isRemote = true;

const uri = isRemote ? remote_uri : 'mongodb://localhost:27017/test';

// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(uri, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB conected: ', uri);
});

// Use routes
app.use('/api/projects', projectsRouter); // Separate base path for projects
app.use('/api/users', userManagerRouter);  // Separate base path for users
app.use('/api/images', imageManagerRouter); // Separate base path for images
app.use('/api/patients', patientManagerRouter); // Separate base path for patients

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});