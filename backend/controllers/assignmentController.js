const Assignment = require('../models/Assignment');
const Project = require('../models/Project');
const User = require('../models/User');

// Helper function to check if a project exists
async function projectExists(projectId) {
  return await Project.exists({ _id: projectId });
}

// Helper function to check if a user exists
async function userExists(userId) {
  return await User.exists({ _id: userId });
}

// Create Assignment
async function createAssignment(req, res) {
  const { user_id } = req.body;
  const { projectId } = req.params; // Use projectId from URL parameters

  try {
    // Check if user and project exist
    const userExistsInDb = await userExists(user_id);
    const projectExistsInDb = await projectExists(projectId);

    if (!userExistsInDb) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!projectExistsInDb) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if an assignment already exists for this user and project
    const existingAssignment = await Assignment.findOne({ user_id, project_id: projectId });
    if (existingAssignment) {
      return res.status(400).json({ error: 'Assignment already exists for this user and project' });
    }

    // Create the assignment
    const assignment = await Assignment.create({ user_id, project_id: projectId });
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment', details: error.message });
  }
}

// Delete Assignment
async function deleteAssignment(req, res) {
  const { projectId, assignmentId } = req.params; // Use projectId from URL parameters

  try {
    // Check if the assignment exists within the specified project
    const assignment = await Assignment.findOneAndDelete({ _id: assignmentId, project_id: projectId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found in this project' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment', details: error.message });
  }
}

// Get Assignments from Project ID
async function getAssignmentsFromProjectId(req, res) {
  const { projectId } = req.params;

  try {
    // Check if the project exists
    const projectExistsInDb = await projectExists(projectId);
    if (!projectExistsInDb) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Fetch assignments associated with the project
    const assignments = await Assignment.find({ project_id: projectId }).populate('user_id', 'name email'); // Optional: populate user details
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments', details: error.message });
  }
}

// Join Project with Invite Code
async function joinProjectWithInviteCode(req, res) {
  const { invite_code, userId } = req.body; // Expect invite_code and userId in the request body

  try {
    // Check if the project with the invite code exists
    const project = await Project.findOne({ invite_code });
    if (!project) {
      return res.status(404).json({ error: 'Invalid invite code. Project not found.' });
    }

    // Check if the user exists
    const userExistsInDb = await userExists(userId);
    if (!userExistsInDb) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if an assignment already exists for this user and project
    const existingAssignment = await Assignment.findOne({ user_id: userId, project_id: project._id });
    if (existingAssignment) {
      return res.status(400).json({ error: 'User is already assigned to this project.' });
    }

    // Create a new assignment for the user in the project
    const assignment = await Assignment.create({ user_id: userId, project_id: project._id });
    res.status(201).json({ message: 'Assignment created successfully.', assignment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join project with invite code', details: error.message });
  }
}

async function approveAssignment(req, res) {
  const { assignmentId } = req.params;

  try {
    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the assignment is pending
    if (assignment.status === 'pending') {
      // Update the status to approved
      assignment.status = 'approved';
      await assignment.save();

      res.status(200).json({ message: 'Assignment approved successfully', assignment });
    } else {
      res.status(400).json({ message: 'Assignment is already approved' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve assignment', details: error.message });
  }
}

module.exports = {
  createAssignment,
  deleteAssignment,
  getAssignmentsFromProjectId,
  joinProjectWithInviteCode,
  approveAssignment
};