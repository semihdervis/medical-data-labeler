import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import backArrow from './icons/back_arrow.png'
import saveIcon from './icons/save.png'
import sorticon from './icons/sort_icon.png'
import previousIcon from './icons/previous.png'
import nextIcon from './icons/next.png'

const LabelingInterface = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)

  // New state for comprehensive image management
  const [images, setImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImage, setCurrentImage] = useState(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `/api/patients/namelist/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setPatients(response.data)
        if (response.data.length > 0) {
          setSelectedPatient(response.data[0])
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    fetchPatients()
  }, [projectId])
  useEffect(() => {
    const fetchImages = async () => {
      if (selectedPatient && selectedPatient._id) {
        try {
          const response = await axios.get(
            `/api/images/${projectId}/${selectedPatient._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )

          // Fetch authenticated image URLs
          const imagePromises = response.data.map(async image => {
            const imageUrl = await fetchImageWithAuth(image.filepath)
            return {
              ...image,
              authenticatedUrl: imageUrl
            }
          })

          const processedImages = await Promise.all(imagePromises)

          setImages(processedImages)

          // Set first image if available
          if (processedImages.length > 0) {
            setCurrentImageIndex(0)
            setCurrentImage(processedImages[0])
          }
        } catch (error) {
          console.error('Error fetching images:', error)
        }
      }
    }

    if (selectedPatient) {
      fetchImages()
    }
  }, [selectedPatient, projectId])
  const handleSave = () => {
    alert('Changes saved!')
  }

  const fetchImageWithAuth = async imagePath => {
    try {
      const response = await axios.get(`http://localhost:3001/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      })
      return URL.createObjectURL(response.data)
    } catch (error) {
      console.error('Error fetching image:', error)
      return null
    }
  }

  // Ensure selectedImage is set when selectedPatient changes
  useEffect(() => {
    // If the selectedPatient has images, set the first image
    if (
      selectedPatient &&
      selectedPatient.images &&
      selectedPatient.images.length > 0
    ) {
      setSelectedImage(selectedPatient.images[0])
    }
  }, [selectedPatient])

  const handleSelectPatient = patient => {
    setSelectedPatient(patient)
  }

  const handleNextImage = () => {
    if (images.length === 0) return

    const nextIndex = (currentImageIndex + 1) % images.length
    setCurrentImageIndex(nextIndex)
    setCurrentImage(images[nextIndex])
  }

  const handlePreviousImage = () => {
    if (images.length === 0) return

    const previousIndex =
      (currentImageIndex - 1 + images.length) % images.length
    setCurrentImageIndex(previousIndex)
    setCurrentImage(images[previousIndex])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  {
    /* PatientListSidebar functions */
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc') // Default sort order
  const [showSortOptions, setShowSortOptions] = useState(false) // State for showing sort options

  // Filter patients based on the search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort patients based on ID
  const sortedPatients = filteredPatients.sort((a, b) => {
    return sortOrder === 'asc'
      ? a._id.localeCompare(b._id)
      : b._id.localeCompare(a._id)
  })

  const handleClick = patient => {
    console.log('Patient selected:', patient) // Log selected patient object
    handleSelectPatient(patient)
  }

  {
    /* End PatientListSidebar functions */
  }

  {
    /* PatientInfoSidebar functions */
  }
  const [personLabels, setPersonLabels] = useState({
    name: selectedPatient?.name || '',
    age: selectedPatient?.age || '',
    gender: selectedPatient?.gender || 'Select',
    healthCondition: selectedPatient?.healthCondition || 'Select',
    overallCondition: selectedPatient?.overallCondition || 'No Issues'
  })

  // Update state when patient prop changes
  useEffect(() => {
    if (selectedPatient) {
      setPersonLabels({
        name: selectedPatient.name || '',
        age: selectedPatient.age || '',
        gender: selectedPatient.gender || 'Select',
        healthCondition: selectedPatient.healthCondition || 'Select',
        overallCondition: selectedPatient.overallCondition || 'No Issues'
      })
    }
  }, [selectedPatient]) // Re-run the effect whenever the 'patient' prop changes

  const handleLabelChange = (label, value) => {
    setPersonLabels({ ...personLabels, [label]: value })
  }

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  {
    /* End PatientInfoSidebar functions */
  }

  {
    /* ImageDisplay functions */
  }

  //const [isModalOpen, setIsModalOpen] = useState(false);
  //const displayImage = selectedImage || "/logo192.png";

  const handleImageClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  {
    /* End ImageDisplay functions */
  }

  return (
    <div
      className={`mt-[60px] flex gap-[15px] p-[20px] min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-[215px]' : ''
      } flex-row`}
    >
      {/* Top Bar */}
      <div className='flex justify-between items-center h-[60px] bg-white rounded-[10px] shadow-[4px_4px_12px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-[20px] mt-[10px] ml-[20px] w-[calc(100%-40px)] z-50'>
        <button
          className='bg-primary ml-[30px] rounded-md border-none cursor-pointer p-[5px] transition-transform duration-200 hover:scale-110'
          onClick={toggleSidebar}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='fill-white w-[24px] h-[24px]'
          >
            <path d='M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z' />
          </svg>
        </button>
        <div className='flex'>
          <button
            className='flex items-center justify-center mr-[10px] bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md'
            onClick={() => navigate('/doctor')}
          >
            <img
              src={backArrow}
              alt='Back Arrow'
              className='w-[20px] h-[20px] mr-[3px]'
            />
            Back to Dashboard
          </button>
          <button
            className='flex items-center justify-center mr-[30px] ml-[10px] bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md'
            onClick={handleSave}
          >
            <img
              src={saveIcon}
              alt='Save'
              className='w-[20px] h-[20px] mr-[3px]'
            />
            Save
          </button>
        </div>
      </div>

      {/* Patient List Sidebar */}
      <div
        className={`max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-[20px] w-[200px] fixed left-[-200px] h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-[220px]' : ''
        }`}
      >
        <h3 className='text-[1.2rem] text-primary mb-[15px] text-center'>
          Patients
        </h3>

        <div className='flex items-center mb-[10px]'>
          <input
            type='text'
            placeholder='Search patients...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md'
          />
          <div className='relative inline-block ml-2'>
            <button
              className='p-0 bg-white transition-transform duration-200 hover:scale-110'
              onClick={() => setShowSortOptions(prev => !prev)}
            >
              <img src={sorticon} alt='Sort' className='w-5 h-5' />
            </button>
            {showSortOptions && (
              <div className='absolute top-full left-0 bg-white rounded-md p-2 z-10 shadow-lg'>
                <button
                  className='block my-1 px-2 py-1 bg-primary text-white rounded-md hover:bg-secondary'
                  onClick={() => {
                    setSortOrder('asc')
                    setShowSortOptions(false)
                  }}
                >
                  Ascending ID
                </button>
                <button
                  className='block my-1 px-2 py-1 bg-primary text-white rounded-md hover:bg-secondary'
                  onClick={() => {
                    setSortOrder('desc')
                    setShowSortOptions(false)
                  }}
                >
                  Descending ID
                </button>
              </div>
            )}
          </div>
        </div>

        <ul className='list-none p-0'>
          {sortedPatients.map(patient => (
            <li
              key={patient.id}
              onClick={() => handleClick(patient)}
              className='p-3 mb-2 cursor-pointer rounded-lg transition-all duration-300 text-center bg-gray-300 hover:bg-gray-400 hover:shadow-md'
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Patient Info Sidebar */}
      <div className='max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-lg p-5 w-[300px]'>
        <h3 className='text-[1.2rem] text-primary mb-4 text-center'>
          Patient Information
        </h3>

        <label className='flex flex-col mb-4 text-sm text-gray-700'>
          Name and Surname:
          <input
            type='text'
            value={personLabels.name}
            onChange={e => handleLabelChange('name', e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          />
        </label>

        <label className='flex flex-col mb-4 text-sm text-gray-700'>
          Age:
          <input
            type='number'
            value={personLabels.age}
            onChange={e => handleLabelChange('age', e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          />
        </label>

        <label className='flex flex-col mb-4 text-sm text-gray-700'>
          Gender:
          <select
            value={personLabels.gender}
            onChange={e => handleLabelChange('gender', e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          >
            <option value='Select' disabled>
              Select
            </option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Other'>Other</option>
          </select>
        </label>

        <label className='flex flex-col mb-4 text-sm text-gray-700'>
          General Health Condition:
          <select
            value={personLabels.healthCondition}
            onChange={e => handleLabelChange('healthCondition', e.target.value)}
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          >
            <option value='Select' disabled>
              Select
            </option>
            <option value='Diabetic'>Diabetic</option>
            <option value='Hypertensive'>Hypertensive</option>
            <option value='Healthy'>Healthy</option>
          </select>
        </label>

        <label className='flex flex-col mb-4 text-sm text-gray-700'>
          Overall Condition Observed:
          <input
            type='text'
            value={personLabels.overallCondition}
            onChange={e =>
              handleLabelChange('overallCondition', e.target.value)
            }
            className='mt-1 p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          />
        </label>
      </div>

      {/* Image Display */}
      <div className='relative bg-white rounded-[10px] shadow-lg p-5 flex flex-col items-center justify-center overflow-hidden max-h-[calc(100vh_-_90px)]'>
        {currentImage && (
          <img
            src={currentImage.authenticatedUrl}
            alt='Patient Medical'
            onClick={() => setIsModalOpen(true)}
            className='max-w-full max-h-[80vh] rounded-md mb-4 mt-5'
          />
        )}
        <div className='flex justify-around items-center w-full mt-5'>
          <button
            onClick={handlePreviousImage}
            className='p-0 bg-white transition-transform duration-300 hover:scale-110'
          >
            <img src={previousIcon} alt='Previous' className='w-5 h-5' />
          </button>
          <button
            onClick={handleNextImage}
            className='p-0 bg-white transition-transform duration-300 hover:scale-110'
          >
            <img src={nextIcon} alt='Next' className='w-5 h-5' />
          </button>
        </div>

        {isModalOpen && currentImage && (
          <div
            className='fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50'
            onClick={() => setIsModalOpen(false)}
          >
            <div className='max-w-[95vw] max-h-[95vh] overflow-hidden'>
              <img
                src={currentImage.authenticatedUrl}
                alt='Enlarged View'
                className='w-full h-auto rounded-lg'
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Labels Sidebar */}
      <div className='max-h-[calc(100vh_-_90px)] overflow-y-auto bg-white rounded-[10px] shadow-lg p-5 w-[320px]'>
        <h3 className='text-[1.2rem] text-primary mb-4 text-center'>
          Image Labels
        </h3>

        <label className='block mb-5 text-sm text-gray-700'>
          Is infection visible?
          <select className='mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>

        <label className='block mb-5 text-sm text-gray-700'>
          Severity of Condition
          <select className='mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'>
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>
        </label>

        <label className='block mb-5 text-sm text-gray-700'>
          Presence of Anomalies
          <input
            type='text'
            placeholder='Describe anomalies'
            className='mt-1 w-full p-2 text-base border border-gray-300 rounded-md focus:border-primary outline-none'
          />
        </label>
      </div>
    </div>
  )
}

export default LabelingInterface
