import React, { useState, useEffect } from 'react';

function PatientInfoSidebar({ patient }) {
  const [personLabels, setPersonLabels] = useState({
    name: patient?.name || "",
    age: patient?.age || "",
    gender: patient?.gender || "Select",
    healthCondition: patient?.healthCondition || "Select",
    overallCondition: patient?.overallCondition || "No Issues"
  });

  // Update state when patient prop changes
  useEffect(() => {
    if (patient) {
      setPersonLabels({
        name: patient.name || "",
        age: patient.age || "",
        gender: patient.gender || "Select",
        healthCondition: patient.healthCondition || "Select",
        overallCondition: patient.overallCondition || "No Issues"
      });
    }
  }, [patient]);  // Re-run the effect whenever the 'patient' prop changes

  const handleLabelChange = (label, value) => {
    setPersonLabels({ ...personLabels, [label]: value });
  };

  return (
    <div className="patient-info-sidebar">
      <h3>Patient Information</h3>

      <label>
        Name and Surname:
        <input
          type="text"
          value={personLabels.name}
          onChange={(e) => handleLabelChange("name", e.target.value)}
        />
      </label>

      <label>
        Age:
        <input
          type="number"
          value={personLabels.age}
          onChange={(e) => handleLabelChange("age", e.target.value)}
        />
      </label>

      <label>
        Gender:
        <select
          value={personLabels.gender}
          onChange={(e) => handleLabelChange("gender", e.target.value)}
        >
          <option value="Select" disabled>Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        General Health Condition:
        <select
          value={personLabels.healthCondition}
          onChange={(e) => handleLabelChange("healthCondition", e.target.value)}
        >
          <option value="Select" disabled>Select</option>
          <option value="Diabetic">Diabetic</option>
          <option value="Hypertensive">Hypertensive</option>
          <option value="Healthy">Healthy</option>
        </select>
      </label>

      <label>
        Overall Condition Observed:
        <input
          type="text"
          value={personLabels.overallCondition}
          onChange={(e) => handleLabelChange("overallCondition", e.target.value)}
        />
      </label>
    </div>
  );
}

export default PatientInfoSidebar;
