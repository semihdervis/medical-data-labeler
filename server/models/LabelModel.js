const mongoose = require('mongoose');

const labelAnswerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  labelData: [
    {type: String, required: true},
  ] 
});

module.exports = mongoose.model('labels', imageSchema);