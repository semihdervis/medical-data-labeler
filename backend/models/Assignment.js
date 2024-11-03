const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigned_at: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  }, // 'status' field to track assignment approval state
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;