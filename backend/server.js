const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// MongoDB URI
const mongoURI = 'mongodb+srv://semihdervis:dbognom@cluster0.js1lg.mongodb.net/my_new_database?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Mongoose Schema for Labels
const labelSchema = new mongoose.Schema({
  person: String,
  image: String,
  name: String,
  surname: String,
  age: String,
  happyOrSad: String,
  maleOrFemale: String,
  tshirtColor: String,
  haveGlasses: String,
  wearingHat: String,
  isSmiling: Boolean,
  backgroundColor: String,
}, { timestamps: true });

const Label = mongoose.model('Label', labelSchema); // Mongoose model for labels

// Enable CORS and body parsing
app.use(cors());
app.use(bodyParser.json());

// Serve images from the "dataset" folder
app.use('/dataset', express.static(path.join(__dirname, 'dataset')));

// Endpoint to get the list of persons (folders in "dataset")
app.get('/api/persons', (req, res) => {
  const datasetDirectory = path.join(__dirname, 'dataset');
  fs.readdir(datasetDirectory, (err, folders) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directories' });
    }
    const persons = folders.filter(folder => fs.lstatSync(path.join(datasetDirectory, folder)).isDirectory());
    res.json(persons);
  });
});

// Endpoint to get the images of a specific person
app.get('/api/images/:person', (req, res) => {
  const person = req.params.person;
  const personDirectory = path.join(__dirname, 'dataset', person);
  fs.readdir(personDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: `Unable to scan files for ${person}` });
    }
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'));
    res.json(imageFiles);
  });
});

// Endpoint to save the labels to MongoDB
app.post('/api/label', async (req, res) => {
  try {
    const labelData = req.body; // Get all label data from request body

    // Create a new Label document and save it to the database
    const label = new Label(labelData);
    await label.save();

    res.json({ message: 'Label saved successfully!', label });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to save the label' });
  }
});

// Endpoint to get all labels from MongoDB
app.get('/api/labels', async (req, res) => {
  try {
    const labels = await Label.find(); // Fetch all labels from MongoDB
    res.json(labels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch labels' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
