const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelDataSchema = new Schema({
  labelQuestion: { type: String, required: true },
  labelType: { type: String, required: true },
  labelOptions: { type: Array, default: [] }
}, { _id: false }); // Disable _id for subdocuments

const LabelSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, required: true },
  labelData: [LabelDataSchema]
});

module.exports = mongoose.model('LabelSchema', LabelSchema);