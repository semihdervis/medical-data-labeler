const LabelSchema = require('../models/LabelSchemaModel')
const LabelAnswer = require('../models/LabelModel')

// Create a new label schema
exports.createLabelSchema = async (req, res) => {
  try {
    const labelSchema = new LabelSchema(req.body)
    await labelSchema.save()
    res.status(201).json(labelSchema)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all label schemas
exports.getAllLabelSchemas = async (req, res) => {
  try {
    const labelSchemas = await LabelSchema.find()
    res.status(200).json(labelSchemas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a label schema by ID
exports.getLabelSchemaById = async (req, res) => {
  try {
    const labelSchema = await LabelSchema.findById(req.params.id)
    if (!labelSchema) {
      return res.status(404).json({ message: 'Label schema not found' })
    }
    res.status(200).json(labelSchema)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a label schema
exports.updateLabelSchema = async (req, res) => {
  try {
    const updatedLabelSchema = await LabelSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedLabelSchema) {
      return res.status(404).json({ message: 'Label schema not found' })
    }
    res.status(200).json(updatedLabelSchema)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a label schema
exports.deleteLabelSchema = async (req, res) => {
  try {
    const labelSchema = await LabelSchema.findById(req.params.id)
    if (!labelSchema) {
      return res.status(404).json({ message: 'Label schema not found' })
    }
    await labelSchema.deleteOne()
    res.status(200).json({ message: 'Label schema deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new label answer
exports.createLabelAnswer = async (req, res) => {
  try {
    const { schemaId, answers } = req.body

    // Fetch the label schema
    const labelSchema = await LabelSchema.findById(schemaId)
    if (!labelSchema) {
      return res.status(404).json({ message: 'Label schema not found' })
    }

    // Validate the label answer
    const schemaFields = labelSchema.labelData.map(field => field.labelQuestion)
    const answerFields = answers.map(answer => answer.field)

    const isValid = answerFields.every(field => schemaFields.includes(field))
    if (!isValid) {
      return res
        .status(400)
        .json({ message: 'Label answer does not match the label schema' })
    }

    const labelAnswer = new LabelAnswer(req.body)
    await labelAnswer.save()
    res.status(201).json(labelAnswer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all label answers
exports.getAllLabelAnswers = async (req, res) => {
  try {
    const labelAnswers = await LabelAnswer.find()
    res.status(200).json(labelAnswers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a label answer by ID
exports.getLabelAnswerById = async (req, res) => {
  try {
    const labelAnswer = await LabelAnswer.findById(req.params.id)
    if (!labelAnswer) {
      return res.status(404).json({ message: 'Label answer not found' })
    }
    res.status(200).json(labelAnswer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a label answer
exports.updateLabelAnswer = async (req, res) => {
  try {
    const updatedLabelAnswer = await LabelAnswer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedLabelAnswer) {
      return res.status(404).json({ message: 'Label answer not found' })
    }
    res.status(200).json(updatedLabelAnswer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a label answer
exports.deleteLabelAnswer = async (req, res) => {
  try {
    const labelAnswer = await LabelAnswer.findById(req.params.id)
    if (!labelAnswer) {
      return res.status(404).json({ message: 'Label answer not found' })
    }
    await labelAnswer.deleteOne()
    res.status(200).json({ message: 'Label answer deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
