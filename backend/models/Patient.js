const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  metadata: {
    age: Number,
    gender: String,
    medical_history: [String]
  },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  images: [
    {
      image_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      image_url: { type: String, required: true },
      description: { type: String }
    }
  ],
  created_at: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;