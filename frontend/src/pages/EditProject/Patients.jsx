import React, { useState, useRef } from "react";
import JSZip from "jszip";
import removeIcon from "../icons/remove.png";
import fileIcon from "../icons/file.png";

function Patients() {
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([
    { id: "Patient1", images: [] },
    { id: "Patient2", images: [] },
    { id: "Patient3", images: [] },
    { id: "Patient4", images: [] },
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState(null);

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
        setPatients((prev) => [...prev, ...importedPatients]);
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

      setPatients((prev) => [...prev, ...newPatients]);
    }
  };

  const handleImageUpload = (event) => {
    if (!selectedPatientId) return;

    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: file.name,
      url: URL.createObjectURL(file),
    }));

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === selectedPatientId
          ? { ...patient, images: [...patient.images, ...newImages] }
          : patient
      )
    );
  };

  const handleRemoveImage = (imageId) => {
    if (!selectedPatientId) return;

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === selectedPatientId
          ? {
              ...patient,
              images: patient.images.filter((image) => image.id !== imageId),
            }
          : patient
      )
    );
  };

  const filteredPatients = patients.filter((patient) =>
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedPatientId
  );

  return (
    <div className="flex flex-col md:flex-row gap-5">
      {/* Patient Management Container */}
      <section className="bg-white rounded-lg p-5 shadow-md w-96">
        <h3 className="text-primary text-lg font-bold mb-4">Patients</h3>

        <input
          type="text"
          placeholder="Search patients by ID..."
          className="w-full mb-4 px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="h-64 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`flex justify-between items-center bg-gray-50 p-3 mb-3 rounded-md shadow-sm cursor-pointer ${
                selectedPatientId === patient.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedPatientId(patient.id)}
            >
              <p className="text-gray-700 font-medium">{patient.id}</p>
              <button
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setPatients((prevPatients) =>
                    prevPatients.filter((p) => p.id !== patient.id)
                  );
                  if (selectedPatientId === patient.id) {
                    setSelectedPatientId(null);
                  }
                }}
              >
                <img src={removeIcon} alt="Remove" className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition w-full mt-3"
          onClick={handleAddPatient}
        >
          Add Patient
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleImportPatients}
        />
        <label
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-3 cursor-pointer"
        >
          Import Patients
          <img src={fileIcon} alt="Import" className="w-4 h-4" />
        </label>

        <input
          type="file"
          ref={zipInputRef}
          className="hidden"
          accept=".zip"
          onChange={handleZipUpload}
        />
        <label
          onClick={() => zipInputRef.current.click()}
          className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-3 cursor-pointer"
        >
          Upload ZIP File
          <img src={fileIcon} alt="Upload ZIP" className="w-4 h-4" />
        </label>
      </section>

      {/* Patient Images Container */}
      <section className="bg-white rounded-lg p-5 shadow-md w-96">
        <h3 className="text-primary text-lg font-bold mb-4">
          {selectedPatient ? `${selectedPatient.id} Images` : "Select a Patient"}
        </h3>

        {selectedPatient && (
          <>
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <label
              onClick={() => imageInputRef.current.click()}
              className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-3 cursor-pointer"
            >
              Upload Images
              <img src={fileIcon} alt="Upload" className="w-4 h-4" />
            </label>

            <div className="h-64 overflow-y-auto mt-4">
              {selectedPatient.images.length > 0 ? (
                selectedPatient.images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center justify-between bg-gray-50 p-3 mb-3 rounded-md shadow-sm"
                  >
                    <img
                      src={image.url}
                      alt={image.id}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <p className="text-gray-700">{image.id}</p>
                    <button
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <img src={removeIcon} alt="Remove" className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No images uploaded.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Patients;
