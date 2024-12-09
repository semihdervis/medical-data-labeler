const LabelSchema = require('../models/LabelSchemaModel')
const LabelAnswer = require('../models/LabelAnswersModel')
const Project = require('../models/ProjectModel')
const Image = require('../models/ImageModel'); // Assuming you have an Image model
const Patient = require('../models/PatientModel'); // Assuming you have a Patient model


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
    const labelSchemas = await LabelSchema.find({ projectId: req.params.id });
    if (!labelSchemas || labelSchemas.length !== 2) {
      return res.status(404).json({ message: 'Label schema not found or incorrect number of schemas' });
    }

    // Ensure the first element is the patient schema and the second is the image schema
    const patientSchema = labelSchemas.find(schema => schema.type === 'patient');
    const imageSchema = labelSchemas.find(schema => schema.type === 'image');

    if (!patientSchema || !imageSchema) {
      return res.status(400).json({ message: 'Schemas are not correctly ordered or missing' });
    }

    res.status(200).json([patientSchema, imageSchema]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

exports.createLabelAnswer = async (req, res) => {
  try {
    const { schemaId, ownerId, answers } = req.body;

    // Fetch the label schema
    const labelSchema = await LabelSchema.findById(schemaId);
    if (!labelSchema) {
      return res.status(404).json({ message: 'Label schema not found' });
    }

    // Fetch the owner document (either image or patient)
    let ownerDocument = await Image.findById(ownerId);
    if (!ownerDocument) {
      ownerDocument = await Patient.findById(ownerId);
    }
    if (!ownerDocument) {
      return res.status(404).json({ message: 'Owner document not found' });
    }

    // Check if the project ID matches
    const projId = ownerDocument.projectId;
    const labelProjId = labelSchema.projectId;
    if (projId.toString() !== labelProjId.toString()) {
      return res.status(400).json({ message: 'Project ID does not match' });
    }

    // Validate the label answer
    const schemaFields = labelSchema.labelData.map(field => field.labelQuestion);
    const answerFields = answers.map(answer => answer.field);

    const isValid = answerFields.every(field => schemaFields.includes(field));
    if (!isValid) {
      return res.status(400).json({ message: 'Label answer does not match the label schema' });
    }

    const labelAnswer = new LabelAnswer({ ownerId, labelData: answers });
    await labelAnswer.save();
    res.status(201).json(labelAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
