import React from 'react';

function PersonLabels({ personLabels, setPersonLabels }) {
  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, { name: "", type: "text" }]);
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
        </div>
      ))}
      <button onClick={handleAddPersonLabel}>Add Person Label</button>
    </section>
  );
}

export default PersonLabels;
