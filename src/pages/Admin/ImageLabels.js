import React from 'react';

function ImageLabels({ imageLabels, setImageLabels }) {
  const handleAddImageLabel = () => {
    setImageLabels([...imageLabels, { name: "", type: "text" }]);
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
              setImageLabels(newLabels);
            }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="slider">Slider</option>
          </select>
        </div>
      ))}
      <button onClick={handleAddImageLabel}>Add Image Label</button>
    </section>
  );
}

export default ImageLabels;
