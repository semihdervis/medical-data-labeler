import React, { useState } from 'react';
import removeIcon from '../icons/remove.png';
import addIcon from '../icons/add.png';

function ImageLabels({ imageLabels, setImageLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [newOption, setNewOption] = useState("");

  const handleAddImageLabel = () => {
    setImageLabels([...imageLabels, { name: "", type: "text", options: [] }]);
  };

  const handleRemoveImageLabel = (indexToRemove) => {
    setImageLabels(imageLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = (labelIndex) => {
    const newLabels = [...imageLabels];
    if (newOption) {
      newLabels[labelIndex].options.push(newOption); // Add new option
      setImageLabels(newLabels);
      setNewOption(""); // Reset the new option input
    }
  };

  const handleRemoveOption = (labelIndex, optionIndex) => {
    const newLabels = [...imageLabels];
    newLabels[labelIndex].options = newLabels[labelIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setImageLabels(newLabels);
  };

  const handleToggleOptions = (index) => {
    setIsOptionsVisible(isOptionsVisible === index ? null : index); // Toggle options visibility
  };

  return (
    <section className="section">
      <h3>Image-Related Labels</h3>
      {imageLabels.map((label, index) => (
        <div key={index} className="label-input">
          <input
            type="text"
            value={label.name}
            placeholder="Enter image label"
            onChange={(e) => {
              const newLabels = [...imageLabels];
              newLabels[index].name = e.target.value;
              setImageLabels(newLabels);
            }}
          />
          <select
            value={label.type}
            onChange={(e) => {
              const newLabels = [...imageLabels];
              newLabels[index].type = e.target.value;
              if (e.target.value !== "dropdown") {
                newLabels[index].options = []; // Clear options if not dropdown
              }
              setImageLabels(newLabels);
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
                          const newLabels = [...imageLabels];
                          newLabels[index].options[optionIndex] = e.target.value;
                          setImageLabels(newLabels);
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
            onClick={() => handleRemoveImageLabel(index)}
          >
            <img src={removeIcon} alt="Remove" style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      ))}
      <button className='in-page-buttons' onClick={handleAddImageLabel}>Add Image Label</button>
    </section>
  );
}

export default ImageLabels;
