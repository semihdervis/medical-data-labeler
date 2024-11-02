import React from 'react';

function Patients({ patients, setPatients }) {
  const handleAddPatient = () => {
    setPatients([...patients, { id: `Patient${patients.length + 1}`, images: [] }]);
  };

  return (
    <section className="section">
      <h3>Patients</h3>
      {patients.map((patient, index) => (
        <div key={patient.id} className="patient-entry">
          <p>{patient.id}</p>
          <button onClick={() => {
            const newPatients = patients.filter((_, i) => i !== index);
            setPatients(newPatients);
          }}>
            Remove Patient
          </button>
        </div>
      ))}
      <button onClick={handleAddPatient}>Add Patient</button>
    </section>
  );
}

export default Patients;
