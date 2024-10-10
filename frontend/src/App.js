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
  const [wearingHat, setWearingHat] = useState('');
  const [isSmiling, setIsSmiling] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [location, setLocation] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [holdingObjects, setHoldingObjects] = useState('');
  const [wearingAccessories, setWearingAccessories] = useState('');
  const [posture, setPosture] = useState('');
  const [company, setCompany] = useState('');
  const [wearingShoes, setWearingShoes] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');

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
              <h3>{selectedPerson}</h3>
            
              <h3>Person-Related Labeling</h3>
              
              <div className="question">
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            
              <div className="question">
                <label>Surname:</label>
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
              </div>
            
              <div className="question">
                <label>Age:</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
            
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
            
              <div className="question">
                <label>Is the person wearing a hat?</label>
                <select value={wearingHat} onChange={(e) => setWearingHat(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            
              <div className="question">
                <label>Is the person smiling?</label>
                <input
                  type="checkbox"
                  checked={isSmiling}
                  onChange={(e) => setIsSmiling(e.target.checked)}
                />
              </div>
            
              <div className="question">
                <label>What is the background color?</label>
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="e.g. White, Black"
                />
              </div>
            
              <div className="question">
                <label>Is the person indoors or outdoors?</label>
                <div>
                  <input
                    type="radio"
                    id="indoors"
                    name="location"
                    value="indoors"
                    checked={location === 'indoors'}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <label htmlFor="indoors">Indoors</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="outdoors"
                    name="location"
                    value="outdoors"
                    checked={location === 'outdoors'}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <label htmlFor="outdoors">Outdoors</label>
                </div>
              </div>
            
              <div className="question">
                <label>What is the person's hair color?</label>
                <input
                  type="text"
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value)}
                  placeholder="e.g. Black, Brown"
                />
              </div>
            
              <div className="question">
                <label>Is the person holding any objects?</label>
                <input
                  type="text"
                  value={holdingObjects}
                  onChange={(e) => setHoldingObjects(e.target.value)}
                  placeholder="e.g. Phone, Book"
                />
              </div>
            
              <div className="question">
                <label>Is the person wearing any accessories?</label>
                <input
                  type="text"
                  value={wearingAccessories}
                  onChange={(e) => setWearingAccessories(e.target.value)}
                  placeholder="e.g. Watch, Necklace"
                />
              </div>
            
              <div className="question">
                <label>Is the person standing or sitting?</label>
                <div>
                  <input
                    type="radio"
                    id="standing"
                    name="posture"
                    value="standing"
                    checked={posture === 'standing'}
                    onChange={(e) => setPosture(e.target.value)}
                  />
                  <label htmlFor="standing">Standing</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="sitting"
                    name="posture"
                    value="sitting"
                    checked={posture === 'sitting'}
                    onChange={(e) => setPosture(e.target.value)}
                  />
                  <label htmlFor="sitting">Sitting</label>
                </div>
              </div>
            
              <div className="question">
                <label>Is the person alone or with others?</label>
                <div>
                  <input
                    type="radio"
                    id="alone"
                    name="company"
                    value="alone"
                    checked={company === 'alone'}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <label htmlFor="alone">Alone</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="withOthers"
                    name="company"
                    value="withOthers"
                    checked={company === 'withOthers'}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <label htmlFor="withOthers">With Others</label>
                </div>
              </div>
            
              <div className="question">
                <label>Is the person wearing shoes?</label>
                <select value={wearingShoes} onChange={(e) => setWearingShoes(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            
              <button
                onClick={handleSave}
                disabled={
                  !happyOrSad || !maleOrFemale || !tshirtColor || !haveGlasses || !wearingHat || !backgroundColor || !location || !hairColor || !holdingObjects || !wearingAccessories || !posture || !company || !wearingShoes
                }
              >
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
