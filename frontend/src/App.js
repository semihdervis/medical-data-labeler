import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import PersonList from './components/PersonList';
import PersonLabelForm from './components/PersonLabelForm';
import ImageDisplay from './components/ImageDisplay';
import ImageLabelForm from './components/ImageLabelForm';

function App() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Labels state
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

  // Fetch the label for the current image if it exists
  useEffect(() => {
    if (selectedPerson && images[currentIndex]) {
      axios.get(`http://localhost:5000/api/labels?person=${selectedPerson}&image=${images[currentIndex]}`)
        .then(response => {
          if (response.data) {
            setLabels(response.data); // Pre-fill the form with existing label data
          } else {
            // Reset labels if no data is found
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
          }
        })
        .catch(error => {
          console.error('There was an error fetching the label!', error);
        });
    }
  }, [selectedPerson, currentIndex, images]);

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

  // Handle changes to the label fields
  const handleLabelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLabels((prevLabels) => ({
      ...prevLabels,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save or update the label
  const handleSave = () => {
    const labelData = {
      person: selectedPerson,
      image: images[currentIndex],
      ...labels, // Include all label fields
    };

    axios.post('http://localhost:5000/api/label', labelData)
      .then(response => {
        alert('Label saved successfully!');
        handleNext(); // Automatically go to the next image
      })
      .catch(error => {
        console.error('There was an error saving the label!', error);
      });
  };

  return (
    <div className="App">
      <div className="main-layout">
        <PersonList persons={persons} setSelectedPerson={setSelectedPerson} />
        
        {selectedPerson && (
          <>
            <PersonLabelForm labels={labels} handleLabelChange={handleLabelChange} />
            <ImageDisplay
              images={images}
              currentIndex={currentIndex}
              handleNext={handleNext}
              handlePrev={handlePrev}
              selectedPerson={selectedPerson}
            />
            <ImageLabelForm labels={labels} handleLabelChange={handleLabelChange} handleSave={handleSave} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
