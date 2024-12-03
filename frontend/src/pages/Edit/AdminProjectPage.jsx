import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectDescription from "./ProjectDescription";
import PersonLabels from "./PersonLabels";
import ImageLabels from "./ImageLabels";
import Patients from "./Patients";
import AssignDoctor from "./AssignDoctor";
import RemoveCurrentProject from "./RemoveCurrentProject";
import ExportProject from "./ExportProject";
import logoutIcon from "../icons/logout_dark.png";

function AdminProjectPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("description");
  const [projectDescription, setProjectDescription] = useState(
    "Project focused on respiratory disease analysis."
  );
  const [personLabels, setPersonLabels] = useState([
    { name: "Name", type: "text" },
  ]);
  const [imageLabels, setImageLabels] = useState([
    { name: "Is infection visible?", type: "dropdown", options: ["Yes", "No"] },
  ]);
  const [patients, setPatients] = useState([
    { id: "Patient001", images: ["img1.jpg", "img2.jpg"] },
  ]);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [activeButton, setActiveButton] = React.useState("description");
  const [projectName, setProjectName] = useState("Respiratory Health Project");

  const handleLogout = () => {
    navigate("/");
  };
  // Assume we have a single project loaded in the editor for simplicity
  const [currentProject, setCurrentProject] = useState({
    id: "P001",
    name: "Respiratory Health Project",
  });

  const handleRemoveProject = (projectId) => {
    // Logic to remove the project goes here (e.g., API call)
    console.log(`Project ${projectId} removed`);
    navigate("/admin");
  };

  const handleExport = () => {
    const projectData = {
      ...currentProject,
      exportDate: new Date().toISOString(),
    };
    return projectData;
  };

  return (
    <div className="flex h-screen bg-gray-100 admin-project-page">
      <Sidebar setActiveSection={setActiveSection} />

      <div className="flex-1 p-5 overflow-y-auto flex justify-center items-center">
        <div className="flex justify-between items-center h-15 bg-indigo-600 rounded-lg shadow-md fixed top-0 left-0 right-[5px] mt-2.5 ml-1.25 px-4 w-[calc(100%-10px)] z-[1000]">
          <button
            onClick={() => navigate("/admin")}
            className={`flex items-center justify-center mr-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors ${
              activeButton === "dashboard-button" ? "bg-indigo-700" : ""
            }`}
          >
            <span>&#60; Go to Dashboard</span>
          </button>

          <button
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="Log out" className="w-5 h-5 mr-0.75" />
            Log Out
          </button>
        </div>
        {activeSection === "description" && (
          <ProjectDescription
            projectName={projectName}
            setProjectName={setProjectName}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
          />
        )}
        {activeSection === "personLabels" && (
          <PersonLabels
            personLabels={personLabels}
            setPersonLabels={setPersonLabels}
          />
        )}
        {activeSection === "imageLabels" && (
          <ImageLabels
            imageLabels={imageLabels}
            setImageLabels={setImageLabels}
          />
        )}
        {activeSection === "patients" && (
          <Patients patients={patients} setPatients={setPatients} />
        )}
        {activeSection === "assignDoctor" && (
          <AssignDoctor
            assignedDoctors={assignedDoctors}
            setAssignedDoctors={setAssignedDoctors}
          />
        )}
        {activeSection === "removeCurrentProject" && (
          <RemoveCurrentProject
            currentProject={currentProject}
            onRemove={handleRemoveProject}
          />
        )}
        {activeSection === "exportProject" && (
          <ExportProject
            currentProject={currentProject}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}

export default AdminProjectPage;