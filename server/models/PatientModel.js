const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    medicalHistory: {
      type: [String],
      default: []
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    completionRate: {
      type: Number,
      default: 0,
      min: [0, 'Completion rate cannot be less than 0'],
      max: [100, 'Completion rate cannot be more than 100']
    }
  },

  {
    timestamps: true
  }
)

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient
