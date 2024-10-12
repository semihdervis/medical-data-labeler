import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import PersonList from './PersonList';
import PersonInfo from './PersonInfo';
import ImageGallery from './ImageGallery';
import ImageLabeling from './ImageLabeling';

function App() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    axios.get('http://localhost:5000/api/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the persons!', error);
      });
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      axios.get(`http://localhost:5000/api/images/${selectedPerson}`)
        .then(response => {
          setImages(response.data);
          setCurrentIndex(0);
        })
        .catch(error => {
          console.error('There was an error fetching the images!', error);
        });
    }
  }, [selectedPerson]);

  const handleLabelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLabels((prevLabels) => ({
      ...prevLabels,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleSave = () => {
    const labelData = {
      person: selectedPerson,
      image: images[currentIndex],
      ...labels,
    };

    axios.post('http://localhost:5000/api/label', labelData)
      .then(response => {
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
        handleNext();
      })
      .catch(error => {
        console.error('There was an error saving the label!', error);
      });
  };

  return (
    <div className="App">
      <div className="main-layout">
        <PersonList persons={persons} onSelectPerson={setSelectedPerson} />
        {selectedPerson && (
          <>
            <PersonInfo
              selectedPerson={selectedPerson}
              labels={labels}
              handleLabelChange={handleLabelChange}
            />
            <ImageGallery
              images={images}
              currentIndex={currentIndex}
              handlePrev={handlePrev}
              handleNext={handleNext}
              selectedPerson={selectedPerson}
            />
            <ImageLabeling
              labels={labels}
              handleLabelChange={handleLabelChange}
              handleSave={handleSave}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
