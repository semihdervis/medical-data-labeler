const Project = require('../models/ProjectModel')
const Patient = require('../models/PatientModel')
const User = require('../models/UserModel') // Import the User model
const patientController = require('./patientController')
const LabelSchema = require('../models/LabelSchemaModel')
const fs = require('fs')
const path = require('path')

const projectsDir = path.join(__dirname, '../projects') // Define the projects directory

exports.getAllProjects = async (req, res) => {
  try {
    let projects
    if (req.userRole === 'admin') {
      // If the user is an admin, fetch all projects
      projects = await Project.find()
    } else {
      // If the user is a doctor, fetch only the projects assigned to them
      const user = await User.findById(req.userId).populate('projects')
      projects = user.projects
    }
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' })
    }
    const newProject = new Project({ name, description })
    await newProject.save()
    const projectDir = path.join(projectsDir, newProject._id.toString())

    // Ensure the parent directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true })
    }

    fs.mkdirSync(projectDir)
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(updatedProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Delegate the deletion of patients to the patientController
    const patients = await Patient.find({ projectId: project._id })

    for (const patient of patients) {
      await patientController.deletePatientById(patient._id)
    }

    // Delete the project's schemas
    await LabelSchema.deleteMany({ projectId: project._id })

    // Delete the project's folder
    const projectDir = path.join(
      __dirname,
      '../projects',
      project._id.toString()
    )
    fs.rmSync(projectDir, { recursive: true, force: true })

    // Delete the project itself
    await project.deleteOne()

    res
      .status(200)
      .json({ message: 'Project and related data deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPatientsByProjectId = async (req, res) => {
  try {
    const patients = await Patient.find({ projectId: req.params.id })
    res.json(patients)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.assignDoctor = async (req, res) => {
  try {
    const { projectId } = req.params
    const { doctorEmail } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const doctor = await User.findOne({ email: doctorEmail })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    doctor.projects.push(project._id)
    await doctor.save()

    res.status(200).json({ message: 'Doctor assigned successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.removeDoctor = async (req, res) => {
  try {
    const { projectId } = req.params
    const { doctorEmail } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const doctor = await User.findOne({ email: doctorEmail })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    if (doctor.projects.includes(project._id)) {
      doctor.projects = doctor.projects.filter(
        id => id.toString() !== project._id.toString()
      )
      await doctor.save()
      return res
        .status(200)
        .json({ message: 'Doctor removed from project successfully' })
    }

    // Warn if doctor is not assigned to project
    return res
      .status(400)
      .json({ message: 'Doctor is not assigned to project' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.updateAssigns = async (req, res) => {
  const { projectId } = req.params
  const { assignedDoctors } = req.body

  console.log('Updating assigns:', assignedDoctors)

  try {
    // Validate input
    if (!Array.isArray(assignedDoctors)) {
      return res
        .status(400)
        .json({ message: 'Assigned doctors must be an array' })
    }

    // Fetch the project
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Remove project from current doctors' project lists
    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    )

    // Track successful and failed assignments
    const successfulAssignments = []
    const failedAssignments = []

    // Assign new doctors to the project
    for (const doctor of assignedDoctors) {
      try {
        console.log('Assigning doctor:', doctor)
        const user = await User.findOne({ email: doctor })
        if (!user) {
          failedAssignments.push(doctor)
          continue
        }

        // Add project to doctor's projects if not already there
        if (!user.projects.includes(projectId)) {
          user.projects.push(projectId)
          await user.save()
          successfulAssignments.push(doctor)
        }
      } catch (assignError) {
        console.error(`Error assigning doctor ${doctor}:`, assignError)
        failedAssignments.push(doctor)
      }
    }

    // Provide detailed response
    return res.status(200).json({
      message: 'Doctors assignment process completed',
      successfulAssignments,
      failedAssignments
    })
  } catch (error) {
    console.error('Error assigning doctors to project:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}
