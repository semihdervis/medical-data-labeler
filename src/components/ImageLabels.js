import React from 'react';

function ImageLabels() {
  return (
    <div className="image-labels">
      <h3>Image Labels</h3>
      <label>
        Infection Visible?
        <select>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>
      <label>
        Severity
        <select>
          <option>Mild</option>
          <option>Moderate</option>
          <option>Severe</option>
        </select>
      </label>
      <label>
        Anomalies
        <input type="text" placeholder="Describe anomalies" />
      </label>
    </div>
  );
}

export default ImageLabels;
