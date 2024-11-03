import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = React.useState("description");

  const handleButtonClick = (section) => {
    setActiveSection(section);
    setActiveButton(section);
  };

  return (
    <aside className="sidebar">
      
    
      <h2>Project Settings</h2>
      <button
        onClick={() => handleButtonClick("description")}
        className={activeButton === "description" ? "active" : ""}
      >
        Project Description
      </button>
      <button
        onClick={() => handleButtonClick("personLabels")}
        className={activeButton === "personLabels" ? "active" : ""}
      >
        Person Labels
      </button>
      <button
        onClick={() => handleButtonClick("imageLabels")}
        className={activeButton === "imageLabels" ? "active" : ""}
      >
        Image Labels
      </button>
      <button
        onClick={() => handleButtonClick("patients")}
        className={activeButton === "patients" ? "active" : ""}
      >
        Patients
      </button>
      <button
        onClick={() => handleButtonClick("assignDoctor")}
        className={activeButton === "assignDoctor" ? "active" : ""}
      >
        Assign Project
      </button>
      <button
        onClick={() => handleButtonClick("removeCurrentProject")}
        className={activeButton === "removeCurrentProject" ? "active" : ""}
      >
        Remove Project
      </button>
    </aside>
  );
}

export default Sidebar;
