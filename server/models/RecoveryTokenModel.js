const mongoose = require('mongoose')

const recoveryTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Token expires in 1 hour
  }
})

module.exports = mongoose.model('RecoveryToken', recoveryTokenSchema)
