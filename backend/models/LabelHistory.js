const mongoose = require('mongoose');

const labelHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient.images.image_id', default: null },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  label_type: { type: String, enum: ['person', 'image'], required: true },
  labels: [
    {
      label_id: { type: String, required: true },
      response: { type: String, required: true }
    }
  ],
  submitted_at: { type: Date, default: Date.now }
});

const LabelHistory = mongoose.model('LabelHistory', labelHistorySchema);
module.exports = LabelHistory;
