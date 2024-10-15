// src/components/PersonLabelForm.js
import React from 'react';

const PersonLabelForm = ({ labels, handleLabelChange }) => {
  return (
    <div className="sidebar sidebar-person-info">
      <h3>Person-Related Labeling</h3>
      <div className="question">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={labels.name}
          onChange={handleLabelChange}
        />
      </div>

      <div className="question">
        <label>Surname:</label>
        <input
          type="text"
          name="surname"
          value={labels.surname}
          onChange={handleLabelChange}
        />
      </div>

      <div className="question">
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={labels.age}
          onChange={handleLabelChange}
        />
      </div>

      <div className="question">
        <label>Is the person Happy or Sad?</label>
        <select
          name="happyOrSad"
          value={labels.happyOrSad}
          onChange={handleLabelChange}
        >
          <option value="">--Select--</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
        </select>
      </div>

      <div className="question">
        <label>Is the person Male or Female?</label>
        <select
          name="maleOrFemale"
          value={labels.maleOrFemale}
          onChange={handleLabelChange}
        >
          <option value="">--Select--</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>
  );
};

export default PersonLabelForm;
