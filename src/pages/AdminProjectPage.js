import React, { useState } from 'react';
import './AdminProjectPage.css';

function AdminProjectPage() {
  const [projectDescription, setProjectDescription] = useState("Project focused on respiratory disease analysis.");
  const [personLabels, setPersonLabels] = useState(["Name", "Age", "Health Condition"]);
  const [imageLabels, setImageLabels] = useState(["Is infection visible?", "Severity", "Presence of anomalies"]);
  const [patients, setPatients] = useState([{ id: "Patient001", images: ["img1.jpg", "img2.jpg"] }]);
  const [doctorEmail, setDoctorEmail] = useState('');

  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, ""]);
  };

  const handleRemovePersonLabel = (index) => {
    setPersonLabels(personLabels.filter((_, i) => i !== index));
  };

  const handlePersonLabelChange = (index, value) => {
    const newLabels = [...personLabels];
    newLabels[index] = value;
    setPersonLabels(newLabels);
  };

  const handleAddImageLabel = () => {
    setImageLabels([...imageLabels, ""]);
  };

  const handleRemoveImageLabel = (index) => {
    setImageLabels(imageLabels.filter((_, i) => i !== index));
  };

  const handleImageLabelChange = (index, value) => {
    const newLabels = [...imageLabels];
    newLabels[index] = value;
    setImageLabels(newLabels);
  };

  const handleAddPatient = () => {
    const newPatient = { id: `Patient${patients.length + 1}`, images: [] };
    setPatients([...patients, newPatient]);
  };

  const handleRemovePatient = (index) => {
    setPatients(patients.filter((_, i) => i !== index));
  };

  const handleAddImageToPatient = (patientIndex) => {
    const updatedPatients = [...patients];
    updatedPatients[patientIndex].images.push(`img${updatedPatients[patientIndex].images.length + 1}.jpg`);
    setPatients(updatedPatients);
  };

  const handleRemoveImageFromPatient = (patientIndex, imageIndex) => {
    const updatedPatients = [...patients];
    updatedPatients[patientIndex].images = updatedPatients[patientIndex].images.filter((_, i) => i !== imageIndex);
    setPatients(updatedPatients);
  };

  const handleAssignProject = () => {
    alert(`Assigned project to doctor with email: ${doctorEmail}`);
    setDoctorEmail('');
  };

  return (
    <div className="admin-project-page">
      <h2>Edit Project</h2>

      {/* Project Description */}
      <section className="section">
        <h3>Project Description</h3>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows="3"
        ></textarea>
      </section>

      {/* Person-Related Labels */}
      <section className="section">
        <h3>Person-Related Labels</h3>
        {personLabels.map((label, index) => (
          <div key={index} className="label-input">
            <input
              type="text"
              value={label}
              onChange={(e) => handlePersonLabelChange(index, e.target.value)}
              placeholder="Enter person label"
            />
            <button onClick={() => handleRemovePersonLabel(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddPersonLabel}>Add Person Label</button>
      </section>

      {/* Image-Related Labels */}
      <section className="section">
        <h3>Image-Related Labels</h3>
        {imageLabels.map((label, index) => (
          <div key={index} className="label-input">
            <input
              type="text"
              value={label}
              onChange={(e) => handleImageLabelChange(index, e.target.value)}
              placeholder="Enter image label"
            />
            <button onClick={() => handleRemoveImageLabel(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddImageLabel}>Add Image Label</button>
      </section>

      {/* Patients Management */}
      <section className="section">
        <h3>Patients</h3>
        {patients.map((patient, patientIndex) => (
          <div key={patient.id} className="patient-section">
            <p>{patient.id}</p>
            <button onClick={() => handleRemovePatient(patientIndex)}>Remove Patient</button>
            <div className="images-section">
              {patient.images.map((image, imageIndex) => (
                <div key={image}>
                  <span>{image}</span>
                  <button onClick={() => handleRemoveImageFromPatient(patientIndex, imageIndex)}>Remove</button>
                </div>
              ))}
              <button onClick={() => handleAddImageToPatient(patientIndex)}>Add Image</button>
            </div>
          </div>
        ))}
        <button onClick={handleAddPatient}>Add Patient</button>
      </section>

      {/* Assign Project to Doctor */}
      <section className="section">
        <h3>Assign Project to Doctor</h3>
        <input
          type="email"
          value={doctorEmail}
          onChange={(e) => setDoctorEmail(e.target.value)}
          placeholder="Enter doctor's email"
        />
        <button onClick={handleAssignProject}>Assign Project</button>
      </section>
    </div>
  );
}

export default AdminProjectPage;
