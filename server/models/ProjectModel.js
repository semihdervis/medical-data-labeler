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
  },
  completionRate: {
    type: Number,
    default: 0,
    min: [0, 'Completion rate cannot be less than 0'],
    max: [100, 'Completion rate cannot be more than 100']
  }
})

module.exports = mongoose.model('Project', projectSchema)
