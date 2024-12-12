import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import backArrow from "./icons/back_arrow.png";
import saveIcon from "./icons/save.png";
import sorticon from "./icons/sort_icon.png";
import previousIcon from "./icons/previous.png";
import nextIcon from "./icons/next.png";

const LabelingInterface = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // New state for comprehensive image management
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `/api/patients/namelist/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
  useEffect(() => {
    const fetchImages = async () => {
      if (selectedPatient && selectedPatient._id) {
        try {
          const response = await axios.get(
            `/api/images/${projectId}/${selectedPatient._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Fetch authenticated image URLs
          const imagePromises = response.data.map(async (image) => {
            const imageUrl = await fetchImageWithAuth(image.filepath);
            return {
              ...image,
              authenticatedUrl: imageUrl,
            };
          });

          const processedImages = await Promise.all(imagePromises);

          setImages(processedImages);

          // Set first image if available
          if (processedImages.length > 0) {
            setCurrentImageIndex(0);
            setCurrentImage(processedImages[0]);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };

    if (selectedPatient) {
      fetchImages();
    }
  }, [selectedPatient, projectId]);
  const handleSave = () => {
    alert("Changes saved!");
  };






  const fetchImageWithAuth = async (imagePath) => {
    try {
      const response = await axios.get(`http://localhost:3001/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  // Ensure selectedImage is set when selectedPatient changes
  useEffect(() => {
    // If the selectedPatient has images, set the first image
    if (
      selectedPatient &&
      selectedPatient.images &&
      selectedPatient.images.length > 0
    ) {
      setSelectedImage(selectedPatient.images[0]);
    }
  }, [selectedPatient]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleNextImage = () => {
    if (images.length === 0) return;

    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setCurrentImage(images[nextIndex]);
  };

  const handlePreviousImage = () => {
    if (images.length === 0) return;

    const previousIndex =
      (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(previousIndex);
    setCurrentImage(images[previousIndex]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  {
    /* PatientListSidebar functions */
  }

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
      ? a._id.localeCompare(b._id)
      : b._id.localeCompare(a._id);
  });

  const handleClick = (patient) => {
    console.log("Patient selected:", patient); // Log selected patient object
    handleSelectPatient(patient);
  };

  {
    /* End PatientListSidebar functions */
  }

  {
    /* PatientInfoSidebar functions */
  }

  const [personLabels, setPersonLabels] = useState([]);
  const [imageLabels, setImageLabels] = useState([]);
  const [personLabelsId, setPersonLabelsId] = useState("");
  const [imageLabelsId, setImageLabelsId] = useState("");
  
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        console.log("project id", projectId);
        const response = await axios.get(`/api/labels/schema/project/${projectId}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const [patientSchema, imageSchema] = response.data;
  
        // Add value property to each person label
        const updatedPersonLabels = patientSchema.labelData.map(label => ({
          ...label,
          value: "" // Default value, you can change it as needed
        }));

        const updatedImageLabels = imageSchema.labelData.map(label => ({
          ...label,
          value: "" // Default value, you can change it as needed
        }));
  
        setPersonLabels(updatedPersonLabels);
        setImageLabels(updatedImageLabels);
        console.log("person schema id", patientSchema._id);
        console.log("image schema id", imageSchema._id);
        setPersonLabelsId(patientSchema._id);
        setImageLabelsId(imageSchema._id);
        setQuestions(updatedPersonLabels);
        console.log("image labels", imageLabels);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };
  
    fetchLabels();
  }, [projectId]);
  
  useEffect(() => {
    console.log("Person labels:", personLabels);
  }, [personLabels]);
  
  useEffect(() => {
    console.log("Image labels:", imageLabels);
  }, [imageLabels]);

  const [questions, setQuestions] = useState([

  ]);
  
  const handleQuestionChange = (index, value) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((q, i) => (i === index ? { ...q, value } : q))
    );
  };

  const handleLabelChange = (index, value) => {
    setImageLabels(prevLabels =>
      prevLabels.map((label, i) => (i === index ? { ...label, value } : label))
    );
  };

  {
    /* End PatientInfoSidebar functions */
  }

  {
    /* ImageDisplay functions */
  }

  //const [isModalOpen, setIsModalOpen] = useState(false);
  //const displayImage = selectedImage || "/logo192.png";

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  {
    /* End ImageDisplay functions */
  }




    // use effect for current image change
    useEffect(() => {
      // axios get request for specific image with http://localhost:3001/answer/:imageid
      const fetchLabels = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/labels/answer/${currentImage._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Fetched labels:", response.data);
          // Handle the response data as needed
        } catch (error) {
          console.error("Error fetching labels:", error);
        }
      };
    
      if (currentImage && currentImage._id) {
        fetchLabels();
      }
    }, [currentImage]);
  
    // use effect for current image again
    useEffect(() => {
      // post in this template 
      //{
      //  "schemaId": "6758800360e976ca83deca28",
      //  "ownerId" : "6758b5c75ff5138a73dccec4",
      //  "answers": [
      //    {
      //      "field": "date2911",
      //      "value": "lmao"
      //    },
      //    {
      //      "field": "lblq1149",
      //      "value": "31"
      //    }
      //  ]
      //}

      const saveLabels = async () => {
        try {
          const answers = imageLabels.map(label => ({
            field: label.labelQuestion,
            value: label.value
          }));
          console.log("Answers:", answers);
          const response = await axios.post(
            `http://localhost:3001/api/labels/answer`,
            {
              schemaId: imageLabelsId,
              ownerId: currentImage._id,
              answers: answers
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Labels saved:", response.data);
          
        } catch (error) {
          console.error("Error saving labels:", error);
        }
      }
  
      
  
      saveLabels();
  
    }, [currentImage]);

  return (
    <div
      className={`mt-[60px] flex gap-[15px] p-[20px] min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "ml-[215px]" : ""
      } flex-row`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center h-[60px] bg-white rounded-[10px] shadow-[4px_4px_12px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-[20px] mt-[10px] ml-[20px] w-[calc(100%-40px)] z-50">
        <button
          className="bg-primary ml-[30px] rounded-md border-none cursor-pointer p-[5px] transition-transform duration-200 hover:scale-110"
          onClick={toggleSidebar}
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
            onClick={() => navigate("/doctor")}
          >
            <img
              src={backArrow}
              alt="Back Arrow"
              className="w-[20px] h-[20px] mr-[3px]"
            />
            Back to Dashboard
          </button>
          <button
            className="flex items-center justify-center mr-[30px] ml-[10px] bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md"
            onClick={handleSave}
          >
            <img
              src={saveIcon}
              alt="Save"
              className="w-[20px] h-[20px] mr-[3px]"
            />
            Save
          </button>
        </div>
      </div>

      {/* Patient List Sidebar */}
      <div
        className={`max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[20px] w-[200px] fixed left-[-200px] h-screen transition-transform duration-300 ease-in-out ${
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
              <div className="absolute top-full left-0 bg-white rounded-md p-2 z-10 shadow-lg">
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
      <div className='max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-lg p-5 w-[300px]'>
    <h3 className='text-[1.2rem] text-primary mb-4 text-center'>Patient Labels</h3>
    {questions.map((question, index) => (
      <label key={index} className='flex flex-col mb-4 text-sm text-gray-700'>
        {question.labelQuestion}:
        {question.labelType === 'text' ? (
          <input
            type='text'
            value={question.value}
            onChange={e => handleQuestionChange(index, e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
            placeholder='Enter text here'
          />
        ) : question.labelType === 'int' ? (
          <input
            type='number'
            value={question.value}
            onChange={e => handleQuestionChange(index, e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
            placeholder='Enter a number'
          />
        ) : question.labelType === 'dropdown' ? (
          <select
            value={question.value}
            onChange={e => handleQuestionChange(index, e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          >
            {question.labelOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}
      </label>
    ))}
  </div>

      {/* Image Display */}
      <div className="relative bg-white rounded-[10px] shadow-lg p-5 flex flex-col items-center justify-center overflow-hidden max-h-[calc(100vh_-_90px)]">
        {currentImage && (
          <img
            src={currentImage.authenticatedUrl}
            alt="Patient Medical"
            onClick={() => setIsModalOpen(true)}
            className="max-w-full max-h-[80vh] rounded-md mb-4 mt-5"
          />
        )}
        <div className="flex justify-around items-center w-full mt-5">
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

        {isModalOpen && currentImage && (
          <div
            className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="max-w-[95vw] max-h-[95vh] overflow-hidden">
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
      <div className="max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-lg p-5 w-[320px]">
    <h3 className="text-[1.2rem] text-primary mb-4 text-center">Image Labels</h3>
    {imageLabels.map((label, index) => (
      <label key={index} className="block mb-5 text-sm text-gray-700">
        {label.labelQuestion}
        {label.labelType === "dropdown" ? (
          <select
            value={label.value}
            onChange={e => handleLabelChange(index, e.target.value)}
            className="mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none"
          >
            {label.labelOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Enter details"
            value={label.value}
            onChange={e => handleLabelChange(index, e.target.value)}
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
