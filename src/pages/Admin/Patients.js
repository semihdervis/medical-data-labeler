import React, { useRef } from 'react';
import removeIcon from '../icons/remove.png';
import fileIcon from '../icons/file.png';

function Patients({ patients, setPatients }) {
  const fileInputRef = useRef(null);

  const handleAddPatient = () => {
    setPatients([...patients, { id: `Patient${patients.length + 1}`, images: [] }]);
  };

  const handleImportPatients = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedPatients = JSON.parse(e.target.result);
        setPatients([...patients, ...importedPatients]);
      };
      reader.readAsText(file);
    }
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
      
      {/* Hidden file input and associated label for "Import Patients from File" */}
      <input
        type="file"
        ref={fileInputRef}
        className="import-patients"
        accept=".json"
        onChange={handleImportPatients}
      />
      <label onClick={() => fileInputRef.current.click()} className="import-patients-label">
        Import Patients
        <img src={fileIcon} alt="Import" style={{ width: '15px', height: '15px' }} />
      </label>
    </section>
  );
}

export default Patients;
