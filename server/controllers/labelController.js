const LabelSchema = require('../models/LabelSchemaModel')
const LabelAnswer = require('../models/LabelAnswersModel')
const Project = require('../models/ProjectModel')
const Image = require('../models/ImageModel') // Assuming you have an Image model
const Patient = require('../models/PatientModel') // Assuming you have a Patient model

// Create a new label schema
exports.createLabelSchema = async (req, res) => {
  try {
    const { projectId } = req.body

    // Check if the project exists
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

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

exports.getLabelSchemaByProjectId = async (req, res) => {
  try {
    const { id } = req.params
    const result = await getLabelSchemaByProjectIdService(id)

    if (result.error) {
      return res.status(result.status).json({ message: result.error })
    }

    res.status(200).json(result.data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Service function version
const getLabelSchemaByProjectIdService = async projectId => {
  try {
    const labelSchemas = await LabelSchema.find({ projectId })
    if (!labelSchemas || labelSchemas.length !== 2) {
      return {
        error: 'Label schema not found or incorrect number of schemas',
        status: 404
      }
    }

    // Ensure the first element is the patient schema and the second is the image schema
    const patientSchema = labelSchemas.find(schema => schema.type === 'patient')
    const imageSchema = labelSchemas.find(schema => schema.type === 'image')

    if (!patientSchema || !imageSchema) {
      return {
        error: 'Schemas are not correctly ordered or missing',
        status: 400
      }
    }

    return { data: [patientSchema, imageSchema] }
  } catch (error) {
    return { error: error.message, status: 500 }
  }
}

exports.getLabelSchemaByProjectIdService = getLabelSchemaByProjectIdService

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

// HTTP endpoint version
exports.createLabelAnswer = async (req, res) => {
  try {
    const { schemaId, ownerId, answers } = req.body
    const result = await createLabelAnswerService(schemaId, ownerId, answers)

    if (result.error) {
      return res.status(result.status).json({ message: result.error })
    }

    res.status(201).json(result.data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// Service function version
const createLabelAnswerService = async (schemaId, ownerId, answers) => {
  try {
    // Fetch the label schema
    const labelSchema = await LabelSchema.findById(schemaId)
    if (!labelSchema) {
      return { error: 'Label schema not found', status: 404 }
    }

    // Fetch the owner document
    let ownerDocument = await Image.findById(ownerId)
    if (!ownerDocument) {
      ownerDocument = await Patient.findById(ownerId)
    }
    if (!ownerDocument) {
      return { error: 'Owner document not found', status: 404 }
    }

    // Check project ID match
    const projId = ownerDocument.projectId
    const labelProjId = labelSchema.projectId
    if (projId.toString() !== labelProjId.toString()) {
      return { error: 'Project ID does not match', status: 400 }
    }

    // Validate answers
    const schemaFields = labelSchema.labelData.map(field => field.labelQuestion)
    const answerFields = answers.map(answer => answer.field)

    const isValid = answerFields.every(field => schemaFields.includes(field))
    if (!isValid) {
      return {
        error: 'Label answer does not match the label schema',
        status: 400
      }
    }

    const labelAnswer = new LabelAnswer({ ownerId, labelData: answers })
    console.log(labelAnswer)
    await labelAnswer.save()
    return { data: labelAnswer }
  } catch (error) {
    throw error
  }
}

exports.createLabelAnswerService = createLabelAnswerService

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
    //const labelAnswer = await LabelAnswer.findById(req.params.id)
    const labelAnswer = await LabelAnswer.findOne({ ownerId: req.params.id })
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
    const updatedLabelAnswer = await LabelAnswer.findOneAndUpdate(
      { ownerId: req.params.ownerId },
      req.body,
      { new: true }
    )

    if (!updatedLabelAnswer) {
      console.log('Err:' + req.params.id)
      console.log(updatedLabelAnswer)
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

exports.getForPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    const images = await Image.find({ patientId })
    const labelAnswers = []
    for (const image of images) {
      const labelAnswer = await LabelAnswer.find({ ownerId: image._id })
      labelAnswers.push(labelAnswer)
    }

    res.status(200).json(labelAnswers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
