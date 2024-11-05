import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProjectPage.css';
import Sidebar from './Sidebar';
import ProjectDescription from './ProjectDescription';
import PersonLabels from './PersonLabels';
import ImageLabels from './ImageLabels';
import Patients from './Patients';
import AssignDoctor from './AssignDoctor';
import RemoveCurrentProject from './RemoveCurrentProject';

function AdminProjectPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("description");
  const [projectDescription, setProjectDescription] = useState("Project focused on respiratory disease analysis.");
  const [personLabels, setPersonLabels] = useState([{ name: "Name", type: "text" }]);
  const [imageLabels, setImageLabels] = useState([{ name: "Is infection visible?", type: "dropdown", options: ["Yes", "No"] }]);
  const [patients, setPatients] = useState([{ id: "Patient001", images: ["img1.jpg", "img2.jpg"] }]);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [activeButton, setActiveButton] = React.useState("description");


  const handleLogout = () => {
    navigate('/');
  };
  // Assume we have a single project loaded in the editor for simplicity
  const [currentProject, setCurrentProject] = useState({
    id: 'P001',
    name: 'Respiratory Health Project'
  });

  const handleRemoveProject = (projectId) => {
    // Logic to remove the project goes here (e.g., API call)
    console.log(`Project ${projectId} removed`);
    navigate('/admin-dashboard'); // Redirect to dashboard after removal
  };

  return (
    <div className="admin-project-page">
      <Sidebar setActiveSection={setActiveSection} />

      <div className="main-content">
        <div className='project-page-top-bar'>
        
        <button 
        onClick={() => navigate('/admin-dashboard')}
        className={activeButton === "dashboard-button" ? "active" : ""}
      >
        &#60; Go to Dashboard
      </button>

      <button className="logout-button" onClick={handleLogout}>Log Out</button>


        </div>
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
        {activeSection === "removeCurrentProject" && (
          <RemoveCurrentProject currentProject={currentProject} onRemove={handleRemoveProject} />
        )}
      </div>
    </div>
  );
}

export default AdminProjectPage;
