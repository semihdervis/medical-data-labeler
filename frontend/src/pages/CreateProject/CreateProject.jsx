  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios"; // For API calls
  import Sidebar from "./Sidebar";
  import ProjectDescription from "./ProjectDescription";
  import PersonLabels from "./PersonLabels";
  import ImageLabels from "./ImageLabels";
  import Patients from "./Patients";
  import AssignDoctor from "./AssignDoctor";
  import logoutIcon from "../icons/logout.png";
  const token = localStorage.getItem('token') // Retrieve the token from local storage

  function CreateProject() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("description");
    const [projectDescription, setProjectDescription] = useState(
      "Project focused on respiratory disease analysis."
    );
    const [personLabels, setPersonLabels] = useState([
      { name: "Name", type: "text", options: ["Yes", "No"] },
    ]);
    const [imageLabels, setImageLabels] = useState([
      { name: "Is infection visible?", type: "dropdown", options: ["Yes", "No"] },
    ]);
    const [patients, setPatients] = useState([
      { id: "Patient001", images: ["img1.jpg", "img2.jpg"] },
    ]);
    const [assignedDoctors, setAssignedDoctors] = useState([]);
    const [activeButton, setActiveButton] = useState("description");
    const [projectName, setProjectName] = useState("Respiratory Health Project");

    const handleLogout = () => {
      navigate("/");
    };

    const handleSave = async () => {
      try {
        // Collect all project data
        const projectData = {
          name: projectName,
          description: projectDescription,
        };
    
        // Make an API call to create the project
        const response = await axios.post(
          "/api/projects/add",
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log("Project created:", response.data._id); // Log the project ID

        // Transform imageLabels array
        const transformedImageLabels = imageLabels.map(label => ({
          labelQuestion: label.name,
          labelType: label.type,
          labelOptions: label.options,
        }));
    
        const imageLabelData = {
          projectId: response.data._id,
          type: "image",
          labelData: transformedImageLabels,
        };
    
        // Make an API call to bind image labels to the project
        const imageLabelResponse = await axios.post(
          "/api/labels/schema",
          imageLabelData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Transform imageLabels array
        const transformedPatientLabels = personLabels.map(label => ({
          labelQuestion: label.name,
          labelType: label.type,
          labelOptions: label.options,
        }));
    
        const patientLabelData = {
          projectId: response.data._id,
          type: "patient",
          labelData: transformedPatientLabels,
        };
    
        // Make an API call to bind image labels to the project
        const patientLabelResponse = await axios.post(
          "/api/labels/schema",
          patientLabelData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.table("Image labels bound to project:", imageLabelResponse.data);
        console.table("Patient labels bound to project:", patientLabelResponse.data);
    
        alert("Project created successfully!");
        navigate("/admin");
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert("Failed to create project. Check the console for more information.");
      }
    };

    return (
      <div className="flex h-screen bg-gray-100 admin-project-page">
        <Sidebar setActiveSection={setActiveSection} />

      <div className="flex-1 p-5 overflow-y-auto flex justify-center items-center">
        <div className="flex justify-between items-center h-12 bg-primary rounded-lg shadow-md fixed top-0 left-0 right-[5px] mt-2.5 ml-1.25 px-4 w-[calc(100%-10px)] z-[1000]">
          <button
            onClick={() => navigate("/admin")}
            className={`flex items-center justify-center mr-2.5 bg-primary hover:bg-secondary text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors ${
              activeButton === "dashboard-button" ? "bg-secondary" : ""
            }`}
          >
            <span>&#60; Go to Dashboard</span>
          </button>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleSave}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors"
            >
              Save
            </button>

            <button
              className="flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="Log out" className="w-5 h-5 mr-1 mt-1" />
              Log Out
            </button>
          </div>
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
      </div>
    </div>
  );
}

  export default CreateProject;
