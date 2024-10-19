const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const UserModel = require('./models/Users');

const app = express();
const PORT = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Utility function to compare schemas
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

// Function to update schema fields in the MongoDB collection
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

// Run schema update when the server starts
updateSchemaFields().then(() => {
  console.log("Documents updated successfully!");
}).catch((error) => {
  console.error("Error updating documents:", error);
});

// Add a user
app.post("/add-user", async (req, res) => {
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
app.get('/getUsers', (req, res) => {
  UserModel.DynamicUsers.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new field to all users
app.post('/add-field', async (req, res) => {
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

// Refresh fields manually
app.get('/refresh-fields', async (req, res) => {
  updateSchemaFields().then(() => {
    console.log("Documents updated successfully!");
    res.send('Fields updated successfully');
  }).catch((error) => {
    console.error("Error updating fields:", error);
    res.status(500).send('Error updating fields');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
