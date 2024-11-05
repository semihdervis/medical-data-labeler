import React from 'react';
import removeIcon from '../icons/remove.png';

function PersonLabels({ personLabels, setPersonLabels }) {
  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, { name: "", type: "text" }]);
  };

  const handleRemovePersonLabel = (indexToRemove) => {
    setPersonLabels(personLabels.filter((_, index) => index !== indexToRemove));
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
              setPersonLabels(newLabels);
            }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="slider">Slider</option>
          </select>
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
