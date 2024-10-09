const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
