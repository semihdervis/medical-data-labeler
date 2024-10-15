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
  const { person, image } = req.body; // Get person and image info from request body

  try {
    // Check if a label for this specific image and person already exists
    const existingLabel = await Label.findOne({ person, image });

    if (existingLabel) {
      // If it exists, update the existing label with the new data
      const updatedLabel = await Label.findOneAndUpdate(
        { person, image },  // Match condition
        req.body,           // Update with the entire request body
        { new: true }       // Return the updated document
      );
      res.json({ message: 'Label updated successfully!', label: updatedLabel });
    } else {
      // If it doesn't exist, create a new label
      const newLabel = new Label(req.body);
      await newLabel.save();
      res.json({ message: 'Label created successfully!', label: newLabel });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to save or update the label' });
  }
});

// Endpoint to get the label for a specific person and image
app.get('/api/labels', async (req, res) => {
  const { person, image } = req.query;
  try {
    const label = await Label.findOne({ person, image }); // Fetch label by person and image
    if (label) {
      res.json(label); // Return the label data if found
    } else {
      res.json(null); // Return null if no label exists
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch label' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
