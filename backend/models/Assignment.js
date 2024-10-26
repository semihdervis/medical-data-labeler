const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigned_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
