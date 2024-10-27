const Patient = require('../models/Patient');
const Project = require('../models/Project');

// Create a new patient
const createPatient = async (req, res) => {
  try {
    const { name, metadata, project_id, images } = req.body;

    // Ensure project exists before adding a patient to it
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newPatient = new Patient({
      name,
      metadata,
      project_id,
      images
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient created successfully!', patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('project_id', 'name');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Get patients by project ID
const getPatientsByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const patients = await Patient.find({ project_id: projectId });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients by project ID', error: error.message });
  }
};



// Get a patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('project_id', 'name');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Update a patient by ID
const updatePatient = async (req, res) => {
  try {
    const { name, metadata, images } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, metadata, images },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully!', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientsByProjectId,
  getPatientById,
  updatePatient,
  deletePatient
};
