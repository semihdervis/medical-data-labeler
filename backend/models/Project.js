const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  labels: {
    person_labels: [
      {
        label_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        label_question: { type: String, required: true },
        input_type: { type: String, required: true },
        options: [String] // Optional dropdown options
      }
    ],
    image_labels: [
      {
        label_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        label_question: { type: String, required: true },
        input_type: { type: String, required: true }
      }
    ]
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;