const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // <-- Import cors

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Serve images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Endpoint to get the list of image file names
app.get('/api/images', (req, res) => {
  const imageDirectory = path.join(__dirname, 'images');
  fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan files' });
    }
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    res.json(imageFiles);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
