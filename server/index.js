const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const UserModel = require('./models/Users');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Add a user
app.post("/add-user", async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser = new UserModel({ name, email, age });

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
  UserModel.find()
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

  try {
    const updateResult = await UserModel.updateMany(
      { [fieldName]: { $exists: false } }, // Only add the field if it doesn't already exist
      { $set: { [fieldName]: defaultValue } }
    );
    res.send(`Added field '${fieldName}' of type '${fieldType}' to all users.`);
    console.log(`Added field '${fieldName}' of type '${fieldType}' to all users.`, updateResult);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding field to users.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
