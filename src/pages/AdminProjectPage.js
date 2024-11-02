import React, { useState } from 'react';
import './AdminProjectPage.css';

function AdminProjectPage() {
  const [activeSection, setActiveSection] = useState("description");
  const [projectDescription, setProjectDescription] = useState("Project focused on respiratory disease analysis.");
  const [personLabels, setPersonLabels] = useState([{ name: "Name", type: "text" }]);
  const [imageLabels, setImageLabels] = useState([{ name: "Is infection visible?", type: "dropdown", options: ["Yes", "No"] }]);
  const [patients, setPatients] = useState([{ id: "Patient001", images: ["img1.jpg", "img2.jpg"] }]);
  const [doctorEmail, setDoctorEmail] = useState('');

  const handleAddPersonLabel = () => setPersonLabels([...personLabels, { name: "", type: "text" }]);
  const handleAddImageLabel = () => setImageLabels([...imageLabels, { name: "", type: "text" }]);
  const handleAddPatient = () => setPatients([...patients, { id: `Patient${patients.length + 1}`, images: [] }]);

  const handleAssignProject = () => {
    alert(`Assigned project to doctor with email: ${doctorEmail}`);
    setDoctorEmail('');
  };

  return (
    <div className="admin-project-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Project Settings</h2>
        <button onClick={() => setActiveSection("description")}>
          Project Description
        </button>
        <button onClick={() => setActiveSection("personLabels")}>
          Person Labels
        </button>
        <button onClick={() => setActiveSection("imageLabels")}>
          Image Labels
        </button>
        <button onClick={() => setActiveSection("patients")}>
          Patients
        </button>
        <button onClick={() => setActiveSection("assignDoctor")}>
          Assign Project
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === "description" && (
          <section className="section">
            <h3>Project Description</h3>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows="3"
            ></textarea>
          </section>
        )}

        {activeSection === "personLabels" && (
          <section className="section">
            <h3>Person-Related Labels</h3>
            {personLabels.map((label, index) => (
              <div key={index} className="label-input">
                <input
                  type="text"
                  value={label.name}
                  placeholder="Enter person label"
                  onChange={(e) => {
                    const newLabels = [...personLabels];
                    newLabels[index].name = e.target.value;
                    setPersonLabels(newLabels);
                  }}
                />
                <select
                  value={label.type}
                  onChange={(e) => {
                    const newLabels = [...personLabels];
                    newLabels[index].type = e.target.value;
                    setPersonLabels(newLabels);
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="slider">Slider</option>
                </select>
              </div>
            ))}
            <button onClick={handleAddPersonLabel}>Add Person Label</button>
          </section>
        )}

        {activeSection === "imageLabels" && (
          <section className="section">
            <h3>Image-Related Labels</h3>
            {imageLabels.map((label, index) => (
              <div key={index} className="label-input">
                <input
                  type="text"
                  value={label.name}
                  placeholder="Enter image label"
                  onChange={(e) => {
                    const newLabels = [...imageLabels];
                    newLabels[index].name = e.target.value;
                    setImageLabels(newLabels);
                  }}
                />
                <select
                  value={label.type}
                  onChange={(e) => {
                    const newLabels = [...imageLabels];
                    newLabels[index].type = e.target.value;
                    setImageLabels(newLabels);
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="slider">Slider</option>
                </select>
              </div>
            ))}
            <button onClick={handleAddImageLabel}>Add Image Label</button>
          </section>
        )}

        {activeSection === "patients" && (
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
        )}

        {activeSection === "assignDoctor" && (
          <section className="section">
            <h3>Assign Project to Doctor</h3>
            <input
              type="email"
              value={doctorEmail}
              placeholder="Enter doctor's email"
              onChange={(e) => setDoctorEmail(e.target.value)}
            />
            <button onClick={handleAssignProject}>Assign Project</button>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminProjectPage;
