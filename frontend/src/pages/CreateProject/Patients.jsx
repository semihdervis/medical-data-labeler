import React, { useState, useRef } from "react";
import JSZip from "jszip";
import removeIcon from "../icons/remove.png";
import fileIcon from "../icons/file.png";

function Patients() {
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined patients for testing
  const [patients, setPatients] = useState([
    { id: "Patient1", images: [] },
    { id: "Patient2", images: [] },
    { id: "Patient3", images: [] },
    { id: "Patient4", images: [] },

  ]);

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

  const handleZipUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const newPatients = [];

      for (const filename of Object.keys(loadedZip.files)) {
        if (filename.endsWith(".json")) {
          const fileContent = await loadedZip.files[filename].async("string");
          const patientData = JSON.parse(fileContent);
          newPatients.push(...patientData);
        }
      }

      setPatients([...patients, ...newPatients]);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-lg">
      <h3 className="text-indigo-600 text-lg font-bold mb-4">Patients</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search patients by ID..."
        className="w-full mb-4 px-3 py-2 border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Scrollable Patient List */}
      <div className="h-64 overflow-y-auto">
        {filteredPatients.slice(0, 10).map((patient, index) => (
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
      </div>

      {/* Add Patient Button */}
      <button
        className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition w-full mt-3"
        onClick={handleAddPatient}
      >
        Add Patient
      </button>

      {/* Import Patients from File */}
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

      {/* Upload ZIP File */}
      <input
        type="file"
        ref={zipInputRef}
        className="hidden"
        accept=".zip"
        onChange={handleZipUpload}
      />
      <label
        onClick={() => zipInputRef.current.click()}
        className="flex items-center gap-2 bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition mt-3 cursor-pointer"
      >
        Upload ZIP File
        <img src={fileIcon} alt="Upload ZIP" className="w-4 h-4" />
      </label>
    </section>
  );
}

export default Patients;
