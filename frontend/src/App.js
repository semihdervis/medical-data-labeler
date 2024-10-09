import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index

  useEffect(() => {
    // Fetch image file names from the backend
    axios.get('http://localhost:5000/api/images')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the images!', error);
      });
  }, []);

  // Function to go to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="App">
      <h1>Image Gallery</h1>

      {/* Display the current image */}
      {images.length > 0 && (
        <div className="image-container">
          <img
            src={`http://localhost:5000/images/${images[currentIndex]}`}
            alt={images[currentIndex]}
          />
        </div>
      )}

      {/* Previous and Next buttons */}
      <div className="buttons">
        <button onClick={handlePrev} disabled={images.length === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={images.length === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
