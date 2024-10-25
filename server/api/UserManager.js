const express = require('express');
const UserModel = require('../models/UserModel.js'); // Import UserModel if it exists
const { model } = require('mongoose');

const router = express.Router();

const compareSchemas = (previousSchema, newSchema) => {
    const fieldsToAdd = {};
    const fieldsToRemove = {};

    // Add or update fields from new schema
    Object.keys(newSchema).forEach((field) => {
        if (!previousSchema[field]) {
            // New field detected
            fieldsToAdd[field] = newSchema[field].defaultValue || null;
        }
    });

    // Remove fields that are in the previous schema but not in the new one
    Object.keys(previousSchema).forEach((field) => {
        if (!newSchema[field]) {
            // Field exists in previous schema but not in new schema
            fieldsToRemove[field] = 1;
        }
    });

    return { fieldsToAdd, fieldsToRemove };
};

const updateSchemaFields = async () => {
    const currentSchema = UserModel.getDynamicUsers(); // Get the current schema
    const newSchema = UserModel.ReReadSchema(); // Correctly read new schema from the config.json
    const { fieldsToAdd, fieldsToRemove } = compareSchemas(currentSchema.obj, newSchema.obj); // Compare schemas using 'obj'

    if (Object.keys(fieldsToAdd).length > 0) {
        await UserModel.DynamicUsers.updateMany({}, { $set: fieldsToAdd }); // Add new fields
    }
    if (Object.keys(fieldsToRemove).length > 0) {
        await UserModel.DynamicUsers.updateMany({}, { $unset: fieldsToRemove }); // Remove old fields
    }
};

// Refresh fields manually
router.get('/refresh-fields', async (req, res) => {
    try {
        await updateSchemaFields();
        console.log("Documents updated successfully!");
        res.send('Fields updated successfully');
    } catch (error) {
        console.error("Error updating fields:", error);
        res.status(500).send('Error updating fields');
    }
});

router.post('/add-field', async (req, res) => {
    const { fieldName, fieldType } = req.body;

    if (!fieldName || !fieldType) {
        return res.status(400).send('Field name and type are required');
    }

    // Determine the default value based on the field type
    let defaultValue;
    switch (fieldType) {
        case 'String':
            defaultValue = '';
            break;
        case 'Number':
            defaultValue = 0;
            break;
        case 'Boolean':
            defaultValue = false;
            break;
        default:
            return res.status(400).send('Invalid field type');
    }

    // Add the new field to all documents
    try {
        await updateSchemaFields(); // Update schema with the new field
        console.log("Documents updated successfully!");
        res.send(`Added field '${fieldName}' of type '${fieldType}' to all users.`);
    } catch (error) {
        console.error("Error updating documents:", error);
        res.status(500).send('Error adding field to users.');
    }
});

router.post("/add-user", async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = new UserModel.DynamicUsers({ name, email, age });

    try {
        await newUser.save();
        res.json('User added!');
        console.log('User added!');
    } catch (err) {
        console.error(err);
        res.status(500).json('Error: ' + err);
    }
});

// Get all users
router.get('/getUsers', (req, res) => {
    UserModel.DynamicUsers.find() // extremely important to use the DynamicUsers model, not the User model
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a user by ID
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;