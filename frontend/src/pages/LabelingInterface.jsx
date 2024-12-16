import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import backArrow from "./icons/back_arrow.png";
import saveIcon from "./icons/save.png";
import sorticon from "./icons/sort_icon.png";
import previousIcon from "./icons/previous.png";
import nextIcon from "./icons/next.png";
 
const LabelingInterface = () => {

  //additional stuff for sort option pop ups
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowSortOptions(false); // Close the popup if clicked outside
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []); 

    const handleSortButtonClick = () => {
    // Toggle the popup on button click
    setShowSortOptions((prev) => !prev);
  };
  
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isAdmin = localStorage.getItem("role") === "admin";
 
  // Core state management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);
 
  // Data state
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
 
  // Labels state
  const [personLabels, setPersonLabels] = useState([]);
  const [imageLabels, setImageLabels] = useState([]);
  const [personLabelsId, setPersonLabelsId] = useState("");
  const [imageLabelsId, setImageLabelsId] = useState("");
  const [currentImageAnswersId, setCurrentImageAnswersId] = useState("");
  const [currentPersonAnswersId, setCurrentPersonAnswersId] = useState("");
 
  // API configuration
  const API_BASE_URL = "http://localhost:3001";
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
 
  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/patients/namelist/${projectId}`,
          getAuthHeaders()
        );
        setPatients(response.data);
        if (response.data.length > 0) {
          setSelectedPatient(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
 
    fetchPatients();
  }, [projectId]);
 
  // Fetch images when patient changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedPatient?._id) return;
 
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/images/${projectId}/${selectedPatient._id}`,
          getAuthHeaders()
        );
 
        const imagePromises = response.data.map(async (image) => {
          const imageUrl = await fetchImageWithAuth(image.filepath);
          return { ...image, authenticatedUrl: imageUrl };
        });
 
        const processedImages = await Promise.all(imagePromises);
        setImages(processedImages);
 
        if (processedImages.length > 0) {
          setCurrentImageIndex(0);
          setCurrentImage(processedImages[0]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
 
    fetchImages();
  }, [selectedPatient, projectId]);
 
  // Fetch label schemas
  useEffect(() => {
    const fetchLabelSchemas = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/labels/schema/project/${projectId}`,
          getAuthHeaders()
        );
        const [patientSchema, imageSchema] = response.data;
 
        const initializeLabels = (schema) => schema.labelData.map(label => ({
          ...label,
          value: ""
        }));
 
        setPersonLabels(initializeLabels(patientSchema));
        setImageLabels(initializeLabels(imageSchema));
        setPersonLabelsId(patientSchema._id);
        setImageLabelsId(imageSchema._id);
      } catch (error) {
        console.error("Error fetching label schemas:", error);
      }
    };
 
    fetchLabelSchemas();
  }, [projectId]);
 
  // Fetch image answers when current image changes
  useEffect(() => {
    const fetchImageAnswers = async () => {
      if (!currentImage?._id) return;
 
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/labels/answer/${currentImage._id}`,
          getAuthHeaders()
        );
 
        setCurrentImageAnswersId(response.data._id);
       
        const updatedLabels = response.data.labelData.map(({ field, ...rest }) => ({
          ...rest,
          labelQuestion: field
        }));
 
        setImageLabels(prevLabels =>
          prevLabels.map(label => {
            const updatedLabel = updatedLabels.find(
              ul => ul.labelQuestion === label.labelQuestion
            );
            return updatedLabel ? { ...label, ...updatedLabel } : label;
          })
        );
      } catch (error) {
        console.error("Error fetching image labels:", error);
      }
    };
 
    fetchImageAnswers();
  }, [currentImage]);
 
  // Fetch person answers when selected patient changes
  useEffect(() => {
    const fetchPersonAnswers = async () => {
      if (!selectedPatient?._id) return;
 
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/labels/answer/${selectedPatient._id}`,
          getAuthHeaders()
        );
 
        setCurrentPersonAnswersId(response.data._id);
 
        const updatedLabels = response.data.labelData.map(({ field, ...rest }) => ({
          ...rest,
          labelQuestion: field
        }));
 
        setPersonLabels(prevLabels =>
          prevLabels.map(label => {
            const updatedLabel = updatedLabels.find(
              ul => ul.labelQuestion === label.labelQuestion
            );
            return updatedLabel ? { ...label, ...updatedLabel } : label;
          })
        );
      } catch (error) {
        console.error("Error fetching person labels:", error);
      }
    };
 
    fetchPersonAnswers();
  }, [selectedPatient]);
 
  // Utility functions
  const fetchImageWithAuth = async (imagePath) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${imagePath}`,
        { ...getAuthHeaders(), responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };
 
  const updateLabels = async (answersId, schemaId, ownerId, labelData) => {
    try {
      console.log("Updating labels:", ownerId, schemaId, labelData);
      await axios.put(
        `${API_BASE_URL}/api/labels/answer/${ownerId}`,
        {
          schemaId,
          ownerId,
          labelData: labelData.map(label => ({
            field: label.labelQuestion,
            value: label.value
          }))
        },
        getAuthHeaders()
      );
    } catch (error) {
      console.error("Error updating labels:", error);
    }
  };
 
  // Event handlers
  const handleSave = async () => {
    await Promise.all([
      updateLabels(currentImageAnswersId, imageLabelsId, currentImage._id, imageLabels),
      updateLabels(currentPersonAnswersId, personLabelsId, selectedPatient._id, personLabels)
    ]);
    //alert("Changes saved successfully!");
  };
 
  const handleSelectPatient = async (patient) => {
    if (currentImage) {
      await updateLabels(currentImageAnswersId, imageLabelsId, currentImage._id, imageLabels);
    }
    handleSave();
    setSelectedPatient(patient);
  };
 
  const handleImageNavigation = async (direction) => {
    if (images.length === 0) return;
 
    await updateLabels(currentImageAnswersId, imageLabelsId, currentImage._id, imageLabels);
 
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
 
    setCurrentImageIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };
 
  const handleLabelChange = (labelSetter) => (index, value) => {
    labelSetter(prevLabels =>
      prevLabels.map((label, i) =>
        i === index ? { ...label, value } : label
      )
    );
  };
 
  // Filter and sort patients
  const filteredAndSortedPatients = patients
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a._id.localeCompare(b._id)
        : b._id.localeCompare(a._id)
    );
 
  // Render label input
  const renderLabelInput = (label, index, handleChange) => {
    const commonProps = {
      value: label.value,
      onChange: (e) => handleChange(index, e.target.value),
      className: "mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
    };
 
    switch (label.labelType) {
      case "dropdown":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {label.labelOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case "int":
        return <input type="number" placeholder="Enter a number" {...commonProps} />;
      default:
        return <input type="text" placeholder="Enter text" {...commonProps} />;
    }
  };
 
  return (
    <div className={`flex gap-[15px] p-[20px] min-h-screen transition-all duration-300 ease-in-out ${
      isSidebarOpen ? "ml-[215px]" : ""
    } flex-row`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center h-[60px] bg-white rounded-[10px] shadow-[4px_4px_12px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-[20px] mt-[10px] ml-[20px] w-[calc(100%-40px)] z-50">
        <button
          className="bg-primary ml-[30px] rounded-md border-none cursor-pointer p-[5px] transition-transform duration-200 hover:scale-110"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-white w-[24px] h-[24px]"
          >
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
       
        <div className="flex">
          <button
            className="flex items-center justify-center mr-[10px] bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md"
            onClick={() => {
              handleSave();
              navigate(isAdmin ? '/admin' : '/doctor');
            }}
          >
            <img src={backArrow} alt="Back" className="w-[20px] h-[20px] mr-[3px]" />
            Back to Dashboard
          </button>
         
          <button
            className="flex items-center justify-center mr-[30px] ml-[10px] bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md"
            onClick={handleSave}
          >
            <img src={saveIcon} alt="Save" className="w-[20px] h-[20px] mr-[3px]" />
            Save
          </button>
        </div>
      </div>
 
      <div className="flex w-full gap-[15px]">
      {/* Patient List Sidebar */}
      <div
        className={`max-h-[calc(100vh_-_100px)] overflow-visible bg-white rounded-[10px] shadow-custom p-[20px] mt-[60px] w-[200px] fixed left-[-200px] h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-[220px]" : ""
        }`}
      >
        <h3 className="text-[1.2rem] text-primary mb-[15px] text-center">
          Patients
        </h3>

        <div className="flex items-center mb-[10px]">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="relative inline-block ml-2">
            <button
              className="p-0 bg-white transition-transform duration-200 hover:scale-110"
              onClick={() => setShowSortOptions((prev) => !prev)}
            >
              <img src={sorticon} alt="Sort" className="w-5 h-5" />
            </button>
            {showSortOptions && (
              <div  ref={popupRef}
              className="absolute top-full left-0 bg-white rounded-md  p-2 z-10 shadow-lg">
                <button
                  className="block my-1 px-2 py-1 bg-primary text-white rounded-md hover:bg-secondary"
                  onClick={() => {
                    setSortOrder("asc");
                    setShowSortOptions(false);
                  }}
                >
                  Ascending ID
                </button>
                <button
                  className="block my-1 px-2 py-1 bg-primary text-white rounded-md hover:bg-secondary"
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

        <ul className="list-none p-0">
          {sortedPatients.map((patient, index) => (
            <li
              key={patient.id || index} // Use patient.id if available, otherwise use index
              onClick={() => handleClick(patient)}
              className="p-3 mb-2 cursor-pointer rounded-lg transition-all duration-300 text-center bg-gray-300 hover:bg-gray-400 hover:shadow-md"
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Patient Info Sidebar */}
      <div className="max-h-[calc(100vh_-_100px)]  mt-[60px] overflow-y-auto bg-white rounded-[10px] shadow-custom p-5 w-[300px]">
        <h3 className="text-[1.2rem] text-primary mb-4 text-center">
          Patient Labels
        </h3>
        {personLabels.map((question, index) => (
          <label
            key={index}
            className="flex flex-col mb-4 text-sm text-gray-700"
          >
            {question.labelQuestion}:
            {question.labelType === "text" ? (
              <input
                type="text"
                value={question.value}
                onChange={(e) => handlePersonLabelChange(index, e.target.value)}
                className="mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
                placeholder="Enter text here"
              />
            ) : question.labelType === "int" ? (
              <input
                type="number"
                value={question.value}
                onChange={(e) => handlePersonLabelChange(index, e.target.value)}
                className="mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
                placeholder="Enter a number"
              />
            ) : question.labelType === "dropdown" ? (
              <select
                value={question.value}
                onChange={(e) => handlePersonLabelChange(index, e.target.value)}
                className="mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
              >
                {question.labelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : null}
          </label>
        ))}
      </div>

      <div className="flex-grow flex flex-col gap-[15px]">
      {/* Image Display */}
      <div className="relative bg-white rounded-[10px] shadow-custom mt-[60px] p-5 flex flex-col items-center justify-center overflow-hidden h-[calc(100vh_-_100px)]">
  {currentImage && (
    <img
      src={currentImage.authenticatedUrl}
      alt="Patient Medical"
      onClick={() => setIsModalOpen(true)}
      className="max-w-full max-h-[80vh] rounded-md mb-4 mt-5"
    />
  )}
  {/* Buttons container repositioned to bottom */}
  <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-40">
    <button
      onClick={handlePreviousImage}
      className="p-0 bg-white transition-transform duration-300 hover:scale-110"
    >
      <img src={previousIcon} alt="Previous" className="w-5 h-5" />
    </button>
    <button
      onClick={handleNextImage}
      className="p-0 bg-white transition-transform duration-300 hover:scale-110"
    >
      <img src={nextIcon} alt="Next" className="w-5 h-5" />
    </button>
  </div>
</div>

        </div>

        {isModalOpen && currentImage && (
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 oveflow-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div className=" max-h-[95vh] overflow-auto">
              <img
                src={currentImage.authenticatedUrl}
                alt="Enlarged View"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

{/* Image Labels Sidebar */}
<div className="max-h-[calc(100vh_-_100px)] overflow-y-auto bg-white rounded-[10px] shadow-custom mt-[60px] p-5 w-[320px]">
  <h3 className="text-[1.2rem] text-primary mb-4 text-center">
    Image Labels
  </h3>
  {imageLabels.map((label, index) => (
    <label key={index} className="block mb-5 text-sm text-gray-700">
      {label.labelQuestion}
      {label.labelType === "dropdown" ? (
        <select
          value={label.value}
          onChange={(e) => handleImageLabelChange(index, e.target.value)}
          className="mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
        >
          {label.labelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : label.labelType === "int" ? (
        <input
          type="number"
          placeholder="Enter a number"
          value={label.value}
          onChange={(e) => handleImageLabelChange(index, e.target.value)}
          className="mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
        />
      ) : (
        <input
          type="text"
          placeholder="Enter details"
          value={label.value}
          onChange={(e) => handleImageLabelChange(index, e.target.value)}
          className="mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
        />
      )}
    </label>
  ))}
</div>

    </div>
  );
};
 
export default LabelingInterface;