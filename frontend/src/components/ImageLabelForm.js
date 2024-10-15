// src/components/ImageLabelForm.js
import React from 'react';

const ImageLabelForm = ({ labels, handleLabelChange, handleSave }) => {
  return (
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

      <button onClick={handleSave}>Save Label</button>
    </div>
  );
};

export default ImageLabelForm;
