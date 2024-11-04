const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helpers = require('./utils/helpers');

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

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.connect(MONGODB_URI, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connected:', MONGODB_URI);
  console.log("\n");
  const random = helpers.generateRandomString(10);
  console.log("admin account: " + random);
});

// serve projects folder
app.use('/projects', express.static('projects'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
 


// generate random string
