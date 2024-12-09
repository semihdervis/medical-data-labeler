const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Project', projectSchema)
