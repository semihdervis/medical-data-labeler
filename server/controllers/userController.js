const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET
const emailService = require('../middlewares/emailService')

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ isAdmin: false }) // filter by isAdmin
    // only return email and name
    const doctorList = doctors.map(doctor => {
      return {
        _id: doctor._id,
        email: doctor.email,
        projects: doctor.projects
      }
    })
    res.status(200).json(doctorList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new user
exports.createUser = async (req, res) => {
  const user = new User(req.body)
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!updatedUser) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

generateRecoveryToken = userId => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' }) // Token expires in 1 hour
  return token
}

validateRecoveryToken = token => {
  try {
    const decoded = jwt.verify(token, secretKey)
    return { isValid: true, userId: decoded.userId }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const token = generateRecoveryToken(user._id)
    const resetLink = `${req.protocol}://${req.get(
      'host'
    )}/reset-password/${token}`

    await emailService.sendEmail({
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`
    })

    res.status(200).json({ message: 'Password reset link sent to your email' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.resetPassword = async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body

  try {
    const { isValid, userId, error } = validateRecoveryToken(token)
    if (!isValid) {
      return res.status(400).json({ message: error })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.password = newPassword // Ensure to hash the password before saving
    await user.save()

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
