import React from 'react';
import removeIcon from '../icons/remove.png';

function Patients({ patients, setPatients }) {
  const handleAddPatient = () => {
    setPatients([...patients, { id: `Patient${patients.length + 1}`, images: [] }]);
  };

  return (
    <section className="section">
      <h3>Patients</h3>
      {patients.map((patient, index) => (
        <div key={patient.id} className="patient-entry">
          <p className="patient-id">{patient.id}</p>
          <button
            className="remove-icons"
            onClick={() => {
              const newPatients = patients.filter((_, i) => i !== index);
              setPatients(newPatients);
            }}
          >
            <img src={removeIcon} alt="Remove" style={{ width: '20px', height: '20px' }} />
            </button>
        </div>
      ))}
      <button className="in-page-buttons" onClick={handleAddPatient}>
        Add Patient
      </button>
    </section>
  );
}

export default Patients;
