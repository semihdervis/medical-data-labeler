import React, { useState } from 'react';
import removeIcon from '../icons/remove.png';
import addIcon from '../icons/add.png';


function PersonLabels({ personLabels, setPersonLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [newOption, setNewOption] = useState("");

  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, { name: "", type: "text", options: [] }]);
  };

  const handleRemovePersonLabel = (indexToRemove) => {
    setPersonLabels(personLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = (labelIndex) => {
    const newLabels = [...personLabels];
    if (newOption) {
      newLabels[labelIndex].options.push(newOption); // Add new option
      setPersonLabels(newLabels);
      setNewOption(""); // Reset the new option input
    }
  };

  const handleRemoveOption = (labelIndex, optionIndex) => {
    const newLabels = [...personLabels];
    newLabels[labelIndex].options = newLabels[labelIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setPersonLabels(newLabels);
  };

  const handleToggleOptions = (index) => {
    setIsOptionsVisible(isOptionsVisible === index ? null : index); // Toggle options visibility
  };

  return (
    <section className="section">
      <h3>Person-Related Labels</h3>
      {personLabels.map((label, index) => (
        <div key={index} className="label-input">
          <input
            type="text"
            value={label.name}
            placeholder="Enter person label"
            onChange={(e) => {
              const newLabels = [...personLabels];
              newLabels[index].name = e.target.value;
              setPersonLabels(newLabels);
            }}
          />
          <select
            value={label.type}
            onChange={(e) => {
              const newLabels = [...personLabels];
              newLabels[index].type = e.target.value;
              if (e.target.value !== "dropdown") {
                newLabels[index].options = []; // Clear options if not dropdown
              }
              setPersonLabels(newLabels);
            }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="slider">Slider</option>
          </select>


          {/* Options section toggle */}
          {label.type === "dropdown" && (
            <div>
              <button 
                className="options-toggle" 
                onClick={() => handleToggleOptions(index)}
              >
              Options
              </button>
              {isOptionsVisible === index && (
                <div className="options-modal">
                  <h4>Options</h4>
                  {label.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-input">
                      <input
                        type="text"
                        value={option}
                        placeholder="Enter option"
                        onChange={(e) => {
                          const newLabels = [...personLabels];
                          newLabels[index].options[optionIndex] = e.target.value;
                          setPersonLabels(newLabels);
                        }}
                      />
                      <button
                        className="remove-icons"
                        onClick={() => handleRemoveOption(index, optionIndex)}
                      >
                        <img src={removeIcon} alt="Remove Option" style={{ width: '15px', height: '15px' }} />
                      </button>
                    </div>
                  ))}
                  <div className="add-option-container">
                    <input
                      type="text"
                      value={newOption}
                      placeholder="New Option"
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                    <button 
                      className="in-page-buttons" 
                      onClick={() => handleAddOption(index)}
                    >
                        <img src={addIcon} alt="Add Option" style={{ width: '15px', height: '15px' }} />
                        </button>
                  </div>
                </div>
              )}
            </div>
          )}
                    <button
            className="remove-icons"
            onClick={() => handleRemovePersonLabel(index)}
          >
            <img src={removeIcon} alt="Remove" style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      ))}
      <button className='in-page-buttons' onClick={handleAddPersonLabel}>Add Person Label</button>
    </section>
  );
}

export default PersonLabels;
