const mongoose = require('mongoose')

// an image or a patient labels will be held in the same collection as there is no need to separate them
// everything will be decided by type of owner, mapping will be done by ownerId's type (image or patient)

const labelAnswerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId, // image or patient id
    required: true
  },
  labelData: [
    {
      field: { type: String, required: true },
      value: { type: String }
    }
  ]
})

module.exports = mongoose.model('labelAnswers', labelAnswerSchema)
