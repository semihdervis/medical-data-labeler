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
    <aside className="bg-indigo-600 text-white p-5 rounded-lg w-64 sticky top-20 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Project Settings</h2>
      <button
        onClick={() => handleButtonClick("description")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "description"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Project Details
      </button>
      <button
        onClick={() => handleButtonClick("personLabels")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "personLabels"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Person Labels
      </button>
      <button
        onClick={() => handleButtonClick("imageLabels")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "imageLabels"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Image Labels
      </button>
      <button
        onClick={() => handleButtonClick("patients")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "patients"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Patients
      </button>
      <button
        onClick={() => handleButtonClick("assignDoctor")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "assignDoctor"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Assign Project
      </button>
      <button
        onClick={() => handleButtonClick("exportProject")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "exportProject"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Export Project
      </button>
      <button
        onClick={() => handleButtonClick("removeCurrentProject")}
        className={`w-full py-2 px-3 rounded-md font-medium text-left transition ${
          activeButton === "removeCurrentProject"
            ? "bg-indigo-800 shadow-md"
            : "bg-indigo-700 hover:bg-indigo-800"
        }`}
      >
        Remove Project
      </button>
    </aside>
  );
}

export default Sidebar;
