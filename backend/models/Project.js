const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  invite_code: { type: String, unique: true, required: true, minlength: 5, maxlength: 5 },
  created_at: { type: Date, default: Date.now },
  labels: {
    person_labels: [
      {
        label_name: { type: String, required: true },
        label_question: { type: String, required: true },
        input_type: { type: String, required: true }, // number
        options: [mongoose.Schema.Types.Mixed] // Optional dropdown options
      }
    ],
    image_labels: [
      {
        label_name: { type: String, required: true },
        label_question: { type: String, required: true },
        input_type: { type: String, required: true },
        options: [mongoose.Schema.Types.Mixed] // Optional dropdown options
      }
    ]
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;