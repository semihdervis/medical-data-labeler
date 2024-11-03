import React from 'react';

function PatientInfoSidebar({ patient }) {
  if (!patient) return <div className="patient-info-sidebar">Select a patient to view information</div>;

  return (
    <div className="patient-info-sidebar">
      <h3>Patient Information</h3>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> 45</p>
      <p><strong>Gender:</strong> Male</p>
      <p><strong>Health Condition:</strong> Hypertensive</p>
      <p><strong>Overall Condition:</strong> Signs of Inflammation</p>
    </div>
  );
}

export default PatientInfoSidebar;
