import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./LabelingInterface.css";
import PatientInfoSidebar from "./PatientInfoSidebar";
import ImageLabelsSidebar from "./ImageLabelsSidebar";
import backArrow from "../icons/back_arrow.png";
import saveIcon from "../icons/save.png";
import sorticon from "../icons/sort_icon.png";
import previousIcon from '../icons/previous.png';
import nextIcon from '../icons/next.png';

function LabelingInterface() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSave = () => {
    alert("Changes saved!");
  };

  const patients = [
    {
      id: "Patient001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      healthCondition: "Hypertensive",
      overallCondition: "Signs of Inflammation",
      images: ["/behcet-hastaligi4.png", "behcet_img3.jpg"],
    },
    {
      id: "Patient002",
      name: "Jane Smith",
      age: 34,
      gender: "Female",
      healthCondition: "Healthy",
      overallCondition: "Good",
      images: ["/behcet_img.jpg", "behcet_img2.png"],
    },
    // Add more patients here
  ];

  // Set the first patient as the default selected patient
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [selectedImage, setSelectedImage] = useState(patients[0].images[0]);

  // Ensure selectedImage is set when selectedPatient changes
  useEffect(() => {
    // If the selectedPatient has images, set the first image
    if (selectedPatient.images && selectedPatient.images.length > 0) {
      setSelectedImage(selectedPatient.images[0]);
    }
  }, [selectedPatient]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleNextImage = () => {
    const currentIndex = selectedPatient.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % selectedPatient.images.length;
    setSelectedImage(selectedPatient.images[nextIndex]);
  };

  const handlePreviousImage = () => {
    const currentIndex = selectedPatient.images.indexOf(selectedImage);
    const previousIndex =
      (currentIndex - 1 + selectedPatient.images.length) %
      selectedPatient.images.length;
    setSelectedImage(selectedPatient.images[previousIndex]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  {/* PatientListSidebar functions */}

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [showSortOptions, setShowSortOptions] = useState(false); // State for showing sort options

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort patients based on ID
  const sortedPatients = filteredPatients.sort((a, b) => {
    return sortOrder === "asc"
      ? a.id.localeCompare(b.id)
      : b.id.localeCompare(a.id);
  });

  const handleClick = (patient) => {
    console.log("Patient selected:", patient); // Log selected patient object
    handleSelectPatient(patient);
  };

  {/* End PatientListSidebar functions */}

  {/* ImageDisplay functions */}

  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayImage = selectedImage || '/logo192.png';

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  {/* End ImageDisplay functions */}

  return (
    <div
      className={`labeling-interface ${isSidebarOpen ? "sidebar-open" : ""}`}
    >
      <div className="label-top-bar">
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
        <div className="container">
          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            <img
              src={backArrow}
              alt="Back Arrow"
              style={{ width: "20px", height: "20px" }}
            />
            Back to Dashboard
          </button>
          <button className="save-button" onClick={handleSave}>
            <img
              src={saveIcon}
              alt="Save"
              style={{ width: "20px", height: "20px" }}
            />
            Save
          </button>
        </div>
      </div>
      {/* Patient List Sidebar*/}
      <div className="patient-list-sidebar">
        <h3>Patients</h3>

        <div className="search-sort-container">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="sort-container">
            <button
              className="sortbutton"
              onClick={() => setShowSortOptions((prev) => !prev)}
            >
              <img
                src={sorticon}
                alt="Sort"
                style={{ width: "20px", height: "20px" }}
              />
            </button>
            {showSortOptions && (
              <div className="sort-options">
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setShowSortOptions(false);
                  }}
                >
                  Ascending ID
                </button>
                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setShowSortOptions(false);
                  }}
                >
                  Descending ID
                </button>
              </div>
            )}
          </div>
        </div>

        <ul>
          {sortedPatients.map((patient) => (
            <li key={patient.id} onClick={() => handleClick(patient)}>
              {patient.name}
            </li>
          ))}
        </ul>
      </div>
      {/* End Patient List Sidebar*/}

      {/* Pass the selected patient to PatientInfoSidebar */}
      <PatientInfoSidebar patient={selectedPatient} />

      {/* Image Display */}
      <div className="image-display">
      <img src={displayImage} alt="Patient Medical" onClick={handleImageClick} />
      <div className="image-navigation">
        <button onClick={handlePreviousImage} className="nav-button">
        <img src={previousIcon} alt="Previous" style={{ width: '20px', height: '20px' }} />
        </button>
        <button onClick={handleNextImage} className="nav-button">
        <img src={nextIcon} alt="Next" style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={displayImage} alt="Enlarged View" />
          </div>
        </div>
      )}
    </div>
      {/* End Image Display */}

      <ImageLabelsSidebar />

    </div>
  );
}

export default LabelingInterface;
