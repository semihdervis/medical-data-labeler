const path = require('path') // Import the path module
const fs = require('fs')
const Project = require('../models/ProjectModel')
const User = require('../models/UserModel')

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
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const newProject = new Project({ name });
    await newProject.save();
    const projectDir = path.join(projectsDir, newProject._id.toString());

    // Ensure the parent directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    fs.mkdirSync(projectDir);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    await project.deleteOne()

    // Remove project folder
    const projectDir = path.join(projectsDir, req.params.id)
    fs.rmSync(projectDir, { recursive: true })

    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
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

    if (!project.assignedDoctors.includes(doctor._id)) {
      project.assignedDoctors.push(doctor._id)
      await project.save()
    }

    res.status(200).json(project)
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

    project.assignedDoctors = project.assignedDoctors.filter(
      doctorId => doctorId.toString() !== doctor._id.toString()
    )
    await project.save()

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
