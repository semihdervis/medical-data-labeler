const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectsRouter = require('./api/ProjectManagement');
const userManagerRouter = require('./api/UserManager');

const dotenv = require('dotenv');
dotenv.config();

const uri = `${process.env.MONGODB_URI}/test`;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Use routes
app.use('/api', projectsRouter);
app.use('/api', userManagerRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});