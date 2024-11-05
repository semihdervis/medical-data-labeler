import React from 'react';

function ImageLabelsSidebar() {
  return (
    <div className="image-labels-sidebar">
      <h3>Image Labels</h3>
      <label>
        Is infection visible?
        <select>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>
      <label>
        Severity of Condition
        <select>
          <option>Mild</option>
          <option>Moderate</option>
          <option>Severe</option>
        </select>
      </label>
      <label>
        Presence of Anomalies
        <input type="text" placeholder="Describe anomalies" />
      </label>
    </div>
  );
}

export default ImageLabelsSidebar;
