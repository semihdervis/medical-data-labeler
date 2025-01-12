const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const Project = require('../models/ProjectModel')
const Patient = require('../models/PatientModel')
const Image = require('../models/ImageModel')
const LabelAnswer = require('../models/LabelAnswersModel')
const imageController = require('./imageController')
const labelController = require('./labelController')

// Function to create a folder for the patient
const createFolder = (projectId, patientId) => {
  const projectDir = path.join(__dirname, '../projects', projectId.toString())
  const patientDir = path.join(projectDir, patientId.toString())

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true })
    console.log(`Created project directory: ${projectDir}`)
  }

  if (!fs.existsSync(patientDir)) {
    fs.mkdirSync(patientDir, { recursive: true })
    console.log(`Created patient directory: ${patientDir}`)
  }
}

// Controller methods
exports.addPatient = async (req, res) => {
  try {
    const { projectId, name, age, gender } = req.body

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Valid Project ID is required' })
    }

    if (!name || !age || !gender) {
      return res
        .status(400)
        .json({ message: 'All patient fields are required' })
    }

    const projectExists = await Project.findById(projectId)

    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const newPatient = new Patient({ projectId, name, age, gender })
    await newPatient.save()

    // Create folder for the new patient
    createFolder(projectId, newPatient._id)

    // Get schema for this project
    const result = await labelController.getLabelSchemaByProjectIdService(
      projectId
    )
    const [patientSchema, imageSchema] = result.data

    const defaultAnswers = patientSchema.labelData.map(label => {
      return {
        field: label.labelQuestion,
        value: label.labelType === 'dropdown' ? label.labelOptions[0] : '' // if dropdown, then first option, if text or number, then empty string
      }
    })

    // Create answer document for this patient
    const newAnswer = await labelController.createLabelAnswerService(
      patientSchema._id, // Pass the ObjectId of the patient schema
      newPatient._id, // Pass the ObjectId of the patient
      defaultAnswers
    )

    console.log('newAnswer', newAnswer)

    res.status(201).json(newPatient)
  } catch (error) {
    console.error('Error adding patient:', error)
    res.status(500).json({ message: error.message })
  }
}

// get a list of patients only consisting of their names and ids

// Get list of patient names
exports.getPatientsList = async (req, res) => {
  try {
    const { id } = req.params
    const patients = await Patient.find({ projectId: id }, 'name') // Only select the 'name' field
    res.status(200).json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllPatients = async (req, res) => {
  const { id } = req.params // Access the project ID from the URL parameters
  try {
    const patients = await Patient.find({ projectId: id })
    res.status(200).json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPatientById = async (req, res) => {
  const { id, patientId } = req.params // Access the project ID and patient ID from the URL parameters
  try {
    const patient = await Patient.findOne({ _id: patientId, projectId: id }) // Search by both projectId and patientId
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(200).json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updatePatient = async (req, res) => {
  const { id, patientId } = req.params // Access the project ID and patient ID from the URL parameters
  const updateData = req.body // Extract update data from the request body
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, projectId: id },
      updateData,
      { new: true }
    )
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    // calculate completion rate based on the number of fields filled in answers of images
    const images = await Image.find({ patientId: patient._id })
    const labelAnswers = []

    for (const image of images) {
      const imageLabelAnswers = await LabelAnswer.findOne({
        ownerId: image._id
      })
      if (imageLabelAnswers) {
        labelAnswers.push(imageLabelAnswers)
      }
    }
    const completionRate = labelAnswers.length / (images.length * updatedPatient.labelData.length)
    console.log('completionRate', completionRate)

    res.status(200).json(updatedPatient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Function to delete a patient by ID
exports.deletePatientById = async patientId => {
  try {
    const patient = await Patient.findById(patientId)
    if (!patient) {
      throw new Error('Patient not found')
    }

    const images = await Image.find({ patientId: patientId })

    for (const image of images) {
      await imageController.deleteImageById(image._id)
    }

    // Delete the patient's label answers
    await LabelAnswer.deleteMany({ ownerId: patient._id })

    // Delete the patient's folder
    const projectDir = path.join(
      __dirname,
      '../projects',
      patient.projectId.toString()
    )
    const patientDir = path.join(projectDir, patient._id.toString())
    fs.rmSync(patientDir, { recursive: true, force: true })

    // Delete the patient itself
    await patient.deleteOne()
  } catch (error) {
    throw new Error(`Error deleting patient: ${error.message}`)
  }
}

// Controller method to handle HTTP DELETE request
exports.deletePatient = async (req, res) => {
  try {
    const { id, patientId } = req.params
    await exports.deletePatientById(patientId)
    res.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
