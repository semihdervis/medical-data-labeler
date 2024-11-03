import React from 'react';

function PatientListSidebar({ onSelectPatient }) {
  const patients = [
    { id: 'Patient001', name: 'John Doe', images: ['img1.jpg', 'img2.jpg'] },
    { id: 'Patient002', name: 'Jane Smith', images: ['img3.jpg', 'img4.jpg'] },
  ];

  return (
    <div className="patient-list-sidebar">
      <h3>Patients</h3>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id} onClick={() => onSelectPatient(patient)}>
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientListSidebar;
