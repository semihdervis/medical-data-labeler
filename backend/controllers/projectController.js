const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
    try {
        const { name, description, labels } = req.body;

        const newProject = new Project({
            name,
            description,
            labels
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully!', project: newProject });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Update a project by ID
const updateProject = async (req, res) => {
    try {
        const { name, description, labels } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description, labels },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};