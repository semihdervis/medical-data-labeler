import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ setActiveSection }) {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = React.useState("description");

  const handleButtonClick = (section) => {
    setActiveSection(section);
    setActiveButton(section);
  };

  return (
    <aside className="bg-primary text-white p-5 rounded-lg w-64 sticky top-20 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Project Settings</h2>
      <button
        onClick={() => handleButtonClick("description")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "description"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Project Details
      </button>
      <button
        onClick={() => handleButtonClick("personLabels")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "personLabels"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Person Labels
      </button>
      <button
        onClick={() => handleButtonClick("imageLabels")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "imageLabels"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Image Labels
      </button>
      <button
        onClick={() => handleButtonClick("patients")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "patients"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Patients
      </button>
      <button
        onClick={() => handleButtonClick("assignDoctor")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "assignDoctor"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Assign Project
      </button>
      <button
        onClick={() => handleButtonClick("exportProject")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "exportProject"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Export Project
      </button>
      <button
        onClick={() => handleButtonClick("removeCurrentProject")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "removeCurrentProject"
            ? "bg-secondary shadow-md"
            : "bg-lightblue hover:bg-secondary"
        }`}
      >
        Remove Project
      </button>
    </aside>
  );
}

export default Sidebar;
