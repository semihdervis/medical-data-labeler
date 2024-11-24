const mongoose = require('mongoose')

const labelSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Assuming 'Project' is the owner model
    required: true
  },
  type: {
    // image schema or patient schema
    type: String,
    required: true
  },
  labelData: [
    {
      labelQuestion: {
        type: String,
        required: true
      },
      labelType: {
        // string, int, float, dropdown etc.
        type: String,
        required: true
      },
      labelOptions: {
        // for dropdowns the selectibles and etc.
        type: [String]
      }
    }
  ]
})

const LabelSchema = mongoose.model('LabelSchema', labelSchema)

module.exports = LabelSchema
