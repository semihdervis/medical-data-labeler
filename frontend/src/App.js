import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use a single state object for all labels
  const [labels, setLabels] = useState({
    name: '',
    surname: '',
    age: '',
    happyOrSad: '',
    maleOrFemale: '',
    tshirtColor: '',
    haveGlasses: '',
    wearingHat: '',
    isSmiling: false,
    backgroundColor: '',
  });

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

  // Handle changes to the label fields
  const handleLabelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLabels((prevLabels) => ({
      ...prevLabels,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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
    const labelData = {
      person: selectedPerson,
      image: images[currentIndex],
      ...labels,  // Spread the labels object to send all fields
    };

    axios.post('http://localhost:5000/api/label', labelData)
      .then(response => {
        console.log(response.data);
        alert('Label saved successfully!');
        setLabels({
          name: '',
          surname: '',
          age: '',
          happyOrSad: '',
          maleOrFemale: '',
          tshirtColor: '',
          haveGlasses: '',
          wearingHat: '',
          isSmiling: false,
          backgroundColor: '',
        });
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
              
              <div className="question">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={labels.name}
                  onChange={handleLabelChange}
                />
              </div>

              <div className="question">
                <label>Surname:</label>
                <input
                  type="text"
                  name="surname"
                  value={labels.surname}
                  onChange={handleLabelChange}
                />
              </div>

              <div className="question">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={labels.age}
                  onChange={handleLabelChange}
                />
              </div>

              <div className="question">
                <label>Is the person Happy or Sad?</label>
                <select
                  name="happyOrSad"
                  value={labels.happyOrSad}
                  onChange={handleLabelChange}
                >
                  <option value="">--Select--</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                </select>
              </div>

              <div className="question">
                <label>Is the person Male or Female?</label>
                <select
                  name="maleOrFemale"
                  value={labels.maleOrFemale}
                  onChange={handleLabelChange}
                >
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
                  name="tshirtColor"
                  value={labels.tshirtColor}
                  onChange={handleLabelChange}
                  placeholder="e.g. Red, Blue"
                />
              </div>

              <div className="question">
                <label>Does the person have glasses?</label>
                <select
                  name="haveGlasses"
                  value={labels.haveGlasses}
                  onChange={handleLabelChange}
                >
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="question">
                <label>Is the person wearing a hat?</label>
                <select
                  name="wearingHat"
                  value={labels.wearingHat}
                  onChange={handleLabelChange}
                >
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="question">
                <label>Is the person smiling?</label>
                <input
                  type="checkbox"
                  name="isSmiling"
                  checked={labels.isSmiling}
                  onChange={handleLabelChange}
                />
              </div>

              <div className="question">
                <label>What is the background color?</label>
                <input
                  type="text"
                  name="backgroundColor"
                  value={labels.backgroundColor}
                  onChange={handleLabelChange}
                  placeholder="e.g. White, Black"
                />
              </div>

              <button onClick={handleSave}>
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
