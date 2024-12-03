import React, { useRef } from "react";
import removeIcon from "../icons/remove.png";
import fileIcon from "../icons/file.png";

function Patients({ patients, setPatients }) {
  const fileInputRef = useRef(null);

  const handleAddPatient = () => {
    setPatients([
      ...patients,
      { id: `Patient${patients.length + 1}`, images: [] },
    ]);
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
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-lg">
      <h3 className="text-indigo-600 text-lg font-bold mb-4">Patients</h3>
      {patients.map((patient, index) => (
        <div
          key={patient.id}
          className="flex justify-between items-center bg-gray-50 p-3 mb-3 rounded-md shadow-sm"
        >
          <p className="text-gray-700 font-medium">{patient.id}</p>
          <button
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
            onClick={() => {
              const newPatients = patients.filter((_, i) => i !== index);
              setPatients(newPatients);
            }}
          >
            <img src={removeIcon} alt="Remove" className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button
        className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition w-full mt-3"
        onClick={handleAddPatient}
      >
        Add Patient
      </button>

      {/* Hidden file input and associated label for "Import Patients from File" */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleImportPatients}
      />
      <label
        onClick={() => fileInputRef.current.click()}
        className="flex items-center gap-2 bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition mt-3 cursor-pointer"
      >
        Import Patients
        <img src={fileIcon} alt="Import" className="w-4 h-4" />
      </label>
    </section>
  );
}

export default Patients;
