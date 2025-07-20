const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const authenticate = async (req, res, next) => {
  console.log('🔐 Authentication Debug:')
  console.log('- URL:', req.originalUrl)
  console.log('- Method:', req.method)
  
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    console.log('❌ No Authorization header')
    return res.status(401).json({ message: 'Authorization header is missing' })
  }

  const token = authHeader.replace('Bearer ', '')
  console.log('- Token present:', !!token)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    console.log('- Token decoded successfully')
    
    const user = await User.findOne({ _id: decoded._id })

    if (!user) {
      console.log('❌ User not found in database')
      throw new Error('User not found')
    }

    console.log('- User found:', user.email)
    console.log('- User role:', user.isAdmin ? 'admin' : 'doctor')
    console.log('- User projects:', user.projects)

    req.userId = user._id
    req.userRole = user.isAdmin ? 'admin' : 'doctor' // Set the user's role
    req.userProjects = user.projects // Set the user's projects
    next()
  } catch (error) {
    console.log('❌ Authentication failed:', error.message)
    res.status(401).json({ message: 'Please authenticate.' })
  }
}

module.exports = authenticate
