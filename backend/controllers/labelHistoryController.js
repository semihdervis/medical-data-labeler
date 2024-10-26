const LabelHistory = require('../models/LabelHistory');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Project = require('../models/Project');

// Submit a new label
const submitLabel = async (req, res) => {
    try {
        const { user_id, patient_id, image_id, project_id, label_type, labels } = req.body;

        // Ensure the user exists and is a doctor
        const user = await User.findById(user_id);
        if (!user || user.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Ensure the patient exists
        const patient = await Patient.findById(patient_id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Ensure the project exists
        const project = await Project.findById(project_id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Select the appropriate labels based on the label type (person/image)
        const requiredLabels =
            label_type === 'person' ? project.labels.person_labels : project.labels.image_labels;

        // Convert required label IDs to strings for easy comparison
        const requiredLabelIds = requiredLabels.map(label => String(label.label_id));

        // Ensure all submitted labels match the project's required labels
        const submittedLabelIds = labels.map(label => String(label.label_id));
        const invalidLabels = submittedLabelIds.filter(id => !requiredLabelIds.includes(id));

        if (invalidLabels.length > 0) {
            return res.status(400).json({
                message: 'Invalid labels submitted',
                invalid_label_ids: invalidLabels
            });
        }

        // Map submitted labels to only include label_id and response
        const labelEntries = labels.map(label => ({
            label_id: label.label_id,
            response: label.response
        }));

        // Create a new label history entry
        const newLabel = new LabelHistory({
            user_id,
            patient_id,
            image_id,
            project_id,
            label_type,
            labels: labelEntries
        });

        await newLabel.save();
        res.status(201).json({ message: 'Label submitted successfully!', label: newLabel });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting label', error: error.message });
    }
};

// Get label history for a specific patient
const getLabelHistoryByPatient = async (req, res) => {
    try {
        const patientId = req.params.patient_id;
        const history = await LabelHistory.find({ patient_id: patientId })
            .populate('user_id', 'name')
            .populate('patient_id', 'name')
            .populate('project_id', 'name');

        if (!history.length) {
            return res.status(404).json({ message: 'No label history found for this patient' });
        }

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching label history', error: error.message });
    }
};

// Get label history by image
const getLabelHistoryByImage = async (req, res) => {
    try {
        const imageId = req.params.image_id;
        const history = await LabelHistory.find({ image_id: imageId })
            .populate('user_id', 'name')
            .populate('patient_id', 'name')
            .populate('project_id', 'name');

        if (!history.length) {
            return res.status(404).json({ message: 'No label history found for this image' });
        }

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching label history', error: error.message });
    }
};

// Delete a specific label entry
const deleteLabelEntry = async (req, res) => {
    try {
        const labelId = req.params.id;
        const deletedLabel = await LabelHistory.findByIdAndDelete(labelId);

        if (!deletedLabel) {
            return res.status(404).json({ message: 'Label entry not found' });
        }

        res.status(200).json({ message: 'Label entry deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting label entry', error: error.message });
    }
};

module.exports = {
    submitLabel,
    getLabelHistoryByPatient,
    getLabelHistoryByImage,
    deleteLabelEntry
};