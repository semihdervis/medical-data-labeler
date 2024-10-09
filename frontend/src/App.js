import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [happyOrSad, setHappyOrSad] = useState('');
  const [maleOrFemale, setMaleOrFemale] = useState('');
  const [tshirtColor, setTshirtColor] = useState('');
  const [haveGlasses, setHaveGlasses] = useState('');

  // Fetch the list of persons (folders)
  useEffect(() => {
    axios.get('http://localhost:5000/api/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the persons!', error);
      });
  }, []);

  // Fetch the images of the selected person
  useEffect(() => {
    if (selectedPerson) {
      axios.get(`http://localhost:5000/api/images/${selectedPerson}`)
        .then(response => {
          setImages(response.data);
          setCurrentIndex(0); // Reset the index when a new person is selected
        })
        .catch(error => {
          console.error('There was an error fetching the images!', error);
        });
    }
  }, [selectedPerson]);

  // Navigate to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Save the labels
  const handleSave = () => {
    const label = {
      person: selectedPerson,
      image: images[currentIndex],
      happyOrSad,
      maleOrFemale,
      tshirtColor,
      haveGlasses
    };

    axios.post('http://localhost:5000/api/label', label)
      .then(response => {
        console.log(response.data);
        alert('Label saved successfully!');
        // Reset selections
        setHappyOrSad('');
        setMaleOrFemale('');
        setTshirtColor('');
        setHaveGlasses('');
        handleNext(); // Automatically go to the next image
      })
      .catch(error => {
        console.error('There was an error saving the label!', error);
      });
  };

  return (
    <div className="App">
      <div className="main-layout">
        {/* Person List Sidebar (far left) */}
        <div className="sidebar sidebar-person-list">
          <h2>Persons</h2>
          <ul>
            {persons.map((person, index) => (
              <li key={index} onClick={() => setSelectedPerson(person)}>
                {person}
              </li>
            ))}
          </ul>
        </div>

        {/* Person Information Sidebar (left of the image) */}
        {selectedPerson && (
          <>
            <div className="sidebar sidebar-person-info">
              <h3>{selectedPerson}'s Information</h3>
              <p>Age: 30</p>
              <p>Occupation: Engineer</p>
              {/* Add more person-related information here */}

              <h3>Person-Related Labeling</h3>
              <div className="question">
                <label>Is the person Happy or Sad?</label>
                <select value={happyOrSad} onChange={(e) => setHappyOrSad(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                </select>
              </div>

              <div className="question">
                <label>Is the person Male or Female?</label>
                <select value={maleOrFemale} onChange={(e) => setMaleOrFemale(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Image Section (center) */}
            <div className="image-section">
              {images.length > 0 ? (
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/dataset/${selectedPerson}/${images[currentIndex]}`}
                    alt={images[currentIndex]}
                  />
                </div>
              ) : (
                <p>No images available for {selectedPerson}</p>
              )}

              {images.length > 0 && (
                <div className="buttons">
                  <button onClick={handlePrev}>Previous</button>
                  <button onClick={handleNext}>Next</button>
                </div>
              )}
            </div>

            {/* Image-Related Labeling Sidebar (right of the image) */}
            <div className="sidebar sidebar-image-info">
              <h3>Image-Related Labeling</h3>

              <div className="question">
                <label>What is the T-shirt color?</label>
                <input
                  type="text"
                  value={tshirtColor}
                  onChange={(e) => setTshirtColor(e.target.value)}
                  placeholder="e.g. Red, Blue"
                />
              </div>

              <div className="question">
                <label>Does the person have glasses?</label>
                <select value={haveGlasses} onChange={(e) => setHaveGlasses(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <button onClick={handleSave} disabled={!happyOrSad || !maleOrFemale || !tshirtColor || !haveGlasses}>
                Save Label
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
