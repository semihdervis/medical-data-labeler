const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// CSV file path
const csvFilePath = path.join(__dirname, 'labels.csv');

// Utility function to generate the CSV writer with dynamic headers
function createCsvWriterWithDynamicHeaders(data, append = true) {
  const headers = Object.keys(data).map(key => ({
    id: key,
    title: key.charAt(0).toUpperCase() + key.slice(1),
  }));
  
  return csvWriter({
    path: csvFilePath,
    header: headers,
    append: append, // If append is true, we don't write the headers again
  });
}

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

// Endpoint to save the labels as CSV with dynamic headers
app.post('/api/label', (req, res) => {
  const labelData = req.body; // Get all label data from request body

  // Check if the CSV file already exists
  const fileExists = fs.existsSync(csvFilePath);
  const fileIsEmpty = fileExists ? fs.statSync(csvFilePath).size === 0 : true;

  // Create the CSV writer with dynamic headers based on the incoming data
  const csv = createCsvWriterWithDynamicHeaders(labelData, append = fileExists && !fileIsEmpty);

  // Write the label data to the CSV file
  csv.writeRecords([labelData])
    .then(() => {
      res.json({ message: 'Label saved successfully!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Unable to save the label' });
    });
});

// Endpoint to get all labels from the CSV file
app.get('/api/labels', (req, res) => {
  const results = [];

  // Check if CSV file exists before reading
  if (fs.existsSync(csvFilePath)) {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results); // Send the CSV data as JSON response
      });
  } else {
    res.json([]); // If file doesn't exist, return an empty array
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
