const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const patientRoutes = require('./routes/patientRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const labelHistoryRoutes = require('./routes/labelHistoryRoutes');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use('/projects', express.static(path.join(__dirname, 'projects')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', patientRoutes);
app.use('/api/projects', assignmentRoutes);
app.use('/api/labels', labelHistoryRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});