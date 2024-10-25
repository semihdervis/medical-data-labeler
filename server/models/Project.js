const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
});

const Project = mongoose.model('projects', projectSchema);
module.exports = Project;
