import React, { useState } from 'react';
import './AdminProjectPage.css';
import Sidebar from './Sidebar';
import ProjectDescription from './ProjectDescription';
import PersonLabels from './PersonLabels';
import ImageLabels from './ImageLabels';
import Patients from './Patients';
import AssignDoctor from './AssignDoctor';

function AdminProjectPage() {
  const [activeSection, setActiveSection] = useState("description");
  const [projectDescription, setProjectDescription] = useState("Project focused on respiratory disease analysis.");
  const [personLabels, setPersonLabels] = useState([{ name: "Name", type: "text" }]);
  const [imageLabels, setImageLabels] = useState([{ name: "Is infection visible?", type: "dropdown", options: ["Yes", "No"] }]);
  const [patients, setPatients] = useState([{ id: "Patient001", images: ["img1.jpg", "img2.jpg"] }]);
  const [assignedDoctors, setAssignedDoctors] = useState([]); // Ensure this is initialized as an empty array

  return (
    <div className="admin-project-page">
      <Sidebar setActiveSection={setActiveSection} />

      <div className="main-content">
        {activeSection === "description" && (
          <ProjectDescription
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
          />
        )}
        {activeSection === "personLabels" && (
          <PersonLabels personLabels={personLabels} setPersonLabels={setPersonLabels} />
        )}
        {activeSection === "imageLabels" && (
          <ImageLabels imageLabels={imageLabels} setImageLabels={setImageLabels} />
        )}
        {activeSection === "patients" && (
          <Patients patients={patients} setPatients={setPatients} />
        )}
        {activeSection === "assignDoctor" && (
          <AssignDoctor assignedDoctors={assignedDoctors} setAssignedDoctors={setAssignedDoctors} />
        )}
      </div>
    </div>
  );
}

export default AdminProjectPage;
