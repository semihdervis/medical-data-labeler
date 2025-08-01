const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const User = require('./models/UserModel')
const helpers = require('./utils/helpers')
const authenticate = require('./middlewares/authenticate')
const Project = require('./models/ProjectModel')
const Patient = require('./models/PatientModel')
const https = require('https');

// Load environment variables from .env file
dotenv.config()

const app = express()

// Debug middleware to log ALL requests
app.use((req, res, next) => {
  console.log('🌐 Request:', req.method, req.originalUrl)
  console.log('- Headers:', Object.keys(req.headers))
  console.log('- User-Agent:', req.headers['user-agent'])
  
  // Special logging for /projects/ requests
  if (req.originalUrl.startsWith('/projects/')) {
    console.log('🖼️ IMAGE REQUEST DETECTED!')
    console.log('- Full URL:', req.originalUrl)
    console.log('- Method:', req.method)
    console.log('- IP:', req.headers['x-real-ip'] || req.ip)
  }
  
  next()
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const patientRoutes = require('./routes/patientRoutes')
const projectRoutes = require('./routes/projectRoutes')
const imageRoutes = require('./routes/imageRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const labelRoutes = require('./routes/labelRoutes') // Import label routes

app.use('/api/patients', patientRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/labels', labelRoutes) // Use label routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    jwtSecretConfigured: !!process.env.JWT_SECRET
  })
})

// Test endpoint to serve images directly via API
app.get('/api/test-image/:projectId/:patientId/:imageId', authenticate, async (req, res) => {
  try {
    const { projectId, patientId, imageId } = req.params
    console.log('🖼️ Test image request:', { projectId, patientId, imageId })
    
    // Check if user has access to this project
    const userProjects = req.userProjects?.map(String) || []
    if (req.userRole !== 'admin' && !userProjects.includes(String(projectId))) {
      return res.status(403).json({ message: 'Access denied to project' })
    }
    
    const imagePath = path.join(__dirname, 'projects', projectId, patientId, imageId)
    console.log('- Looking for image at:', imagePath)
    
    if (fs.existsSync(imagePath)) {
      console.log('✅ Image found, serving...')
      res.sendFile(imagePath)
    } else {
      console.log('❌ Image not found')
      res.status(404).json({ message: 'Image not found' })
    }
  } catch (error) {
    console.error('Error serving test image:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Authorization middleware for static files
const authorize = (req, res, next) => {
  const filePath = req.path
  const projectId = path.basename(path.dirname(path.dirname(filePath)))
  const projects = req.query.projects?.split(',') || [] // Get projects from query

  console.log('🔍 Authorization Debug:')
  console.log('- Full URL:', req.originalUrl)
  console.log('- File path:', filePath)
  console.log('- Extracted project ID:', projectId)
  console.log('- User projects from query:', projects)
  console.log('- User role:', req.userRole)
  console.log('- User ID:', req.userId)

  if (
    req.userRole === 'admin' ||
    (Array.isArray(projects) &&
      projects.map(String).includes(String(projectId)))
  ) {
    console.log('✅ Authorized')
    next()
  } else {
    console.log('❌ Access denied - Project ID not in user projects')
    res.status(403).json({ message: 'Access denied' })
  }
}

// Serve static files with authentication and authorization
app.use('/projects', (req, res, next) => {
  console.log('📁 Projects middleware - Request:', req.method, req.originalUrl)
  console.log('- Path:', req.path)
  console.log('- Query:', req.query)
  
  // Debug file path
  const filePath = path.join(__dirname, 'projects', req.path)
  console.log('- Looking for file at:', filePath)
  console.log('- File exists:', fs.existsSync(filePath))
  
  next()
}, authenticate, authorize, express.static('projects'))

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')))
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/projects/')) {
      return res.status(404).json({ message: 'API endpoint not found' })
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}

const initializeFolder = async folderPath => {
  try {
    // Ensure the base folder exists
    fs.mkdirSync(folderPath, { recursive: true })

    // Fetch all projects from the database
    const projects = await Project.find()

    for (const project of projects) {
      const projectFolderPath = path.join(folderPath, project._id.toString())
      fs.mkdirSync(projectFolderPath, { recursive: true })

      // Fetch all patients associated with the project
      const patients = await Patient.find({ projectId: project._id })

      for (const patient of patients) {
        const patientFolderPath = path.join(
          projectFolderPath,
          patient._id.toString()
        )
        fs.mkdirSync(patientFolderPath, { recursive: true })
      }
    }

    console.log('Folders initialized successfully')
  } catch (error) {
    console.error('Error initializing folders:', error)
  }
}

// Example usage
const folderPath = path.join(__dirname, 'data')
initializeFolder(folderPath)

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

const PORT = process.env.PORT || 3001
const REMOTE_URI = process.env.MONGODB_URI

// Log environment configuration
console.log('🚀 Starting server with configuration:')
console.log('- PORT:', PORT)
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development')
console.log('- JWT_SECRET configured:', !!process.env.JWT_SECRET)
console.log('- MONGODB_URI configured:', !!REMOTE_URI)

const isRemote = true

const MONGODB_URI = isRemote
  ? REMOTE_URI
  : 'mongodb://localhost:27017/medical-labeler'

mongoose.connect(MONGODB_URI, {})

const connection = mongoose.connection
connection.once('open', async () => {
  console.log('MongoDB connected:', MONGODB_URI)
  console.log('\n')

  const randomPassword = helpers.generateRandomString(10)
  console.log('Admin account password: ' + randomPassword)

  // Create or update the admin account
  await createOrUpdateAdminAccount(randomPassword)
})

const createOrUpdateAdminAccount = async password => {
  try {
    const adminEmail = 'admin' // Define the admin email

    let admin = await User.findOne({ email: adminEmail })
    if (admin) {
      // Update the password if the admin account already exists
      admin.password = password
      await admin.save()
      console.log('Admin account updated with new password.')
    } else {
      // Create a new admin account if it doesn't exist
      admin = new User({
        email: adminEmail,
        password: password,
        isAdmin: true
      })
      await admin.save()
      console.log('Admin account created.')
    }
  } catch (error) {
    console.error('Error creating/updating admin account:', error)
  }
}

/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})*/

const isServer = false;

if(isServer){
  const options = {
    key: fs.readFileSync('/home/mel/server/privkey.pem'),
    cert: fs.readFileSync('/home/mel/server/fullchain.pem')
  };
  
  https.createServer(options, app).listen(PORT,'0.0.0.0', () => {
    console.log(`Server running at https://localhost:${PORT}`);
  });
  
}
else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
