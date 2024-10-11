const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser'); // <-- To parse request body

const app = express();
const port = 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(bodyParser.json()); // <-- To handle JSON body requests

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

// Endpoint to save the labels as JSON
app.post('/api/label', (req, res) => {
  const labelData = req.body; // Get all label data from request body

  // Path to the labels JSON file
  const labelsFilePath = path.join(__dirname, 'labels.json');

  // Read the existing labels file
  fs.readFile(labelsFilePath, (err, data) => {
    let labels = [];
    if (!err && data.length > 0) {
      labels = JSON.parse(data); // Parse the existing data if any
    }

    // Add the new label
    labels.push(labelData);

    // Write the updated labels back to the file
    fs.writeFile(labelsFilePath, JSON.stringify(labels, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to save the label' });
      }
      res.json({ message: 'Label saved successfully!' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
