const Patient = require('../models/PatientModel');

const Project = require('../models/Project');

const addPatient = async (patientData) => {
  const projectExists = await Project.findById(patientData.projectId);

  if (!projectExists) {
    throw new Error('Project not found');
  }

  const patient = new Patient(patientData);
  return await patient.save();
};

const getAllPatients = async (projectId) => {
  return await Patient.find({ projectId });
};

const getPatientById = async (id) => {
  return await Patient.findById(id);
};

const updatePatient = async (id, patientData) => {
  return await Patient.findByIdAndUpdate(id, patientData, { new: true });
};

const deletePatient = async (id) => {
  return await Patient.findByIdAndDelete(id);
};

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};