const Assignment = require('../models/Assignment');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { user_id, patient_id, project_id } = req.body;

    // Ensure the user (doctor) exists
    const user = await User.findById(user_id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Ensure the patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create the new assignment
    const newAssignment = new Assignment({
      user_id,
      patient_id,
      project_id
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully!', assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('user_id', 'name')
      .populate('patient_id', 'name')
      .populate('project_id', 'name');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Get a single assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('user_id', 'name')
      .populate('patient_id', 'name')
      .populate('project_id', 'name');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

// Update an assignment status
const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAssignment) {
      console.log(updatedAssignment);
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment updated successfully!', assignment: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete an assignment by ID
const deleteAssignment = async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentStatus,
  deleteAssignment
};