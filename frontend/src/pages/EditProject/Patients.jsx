import React, { useEffect, useState, useRef } from 'react'
import JSZip from 'jszip'
import removeIcon from '../icons/remove.png'
import fileIcon from '../icons/file.png'
import { useParams } from 'react-router-dom'

function Patients ({ patients, setPatients, patientService }) {
  const { id } = useParams()
  const fileInputRef = useRef(null)
  const zipInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState({})

  useEffect(() => {
    const fetchImages = async () => {
      if (selectedPatientId) {
        try {
          const response = await patientService.getPatientImages(
            id,
            selectedPatientId
          )
          setImages(response.data)
          fetchImageUrls(response.data)
        } catch (error) {
          console.error('Error fetching images:', error)
        }
      }
    }

    fetchImages()
  }, [selectedPatientId, id])

  const fetchImageUrls = async images => {
    const urls = {}
    for (const image of images) {
      try {
        const response = await patientService.getImageUrl(image.filepath)
        const url = URL.createObjectURL(response.data)
        urls[image._id] = url
      } catch (error) {
        console.error('Error fetching image:', error)
      }
    }
    setImageUrls(urls)
  }

  const handleAddPatient = () => {
    const newPatient = {
      projectId: id,
      name: `Patient${patients.length + 1}`,
      age: '0',
      gender: 'null'
    }

    const requestId = patientService.addToPatientQueue(newPatient, id)

    setPatients(prevPatients => [
      ...prevPatients,
      {
        _id: requestId,
        ...newPatient,
        isUnsaved: true
      }
    ])
  }

  const handleRemovePatient = patientId => {
    // Queue the patient removal request
    patientService.removePatient(id, patientId)

    // Update the local state
    setPatients(prevPatients =>
      prevPatients.filter(patient => patient._id !== patientId)
    )
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null)
      setImages([])
      setImageUrls({})
    }
  }

  const handleImportPatients = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const importedPatients = JSON.parse(e.target.result)
        setPatients(prev => [...prev, ...importedPatients])
      }
      reader.readAsText(file)
    }
  }

  const handleZipUpload = async event => {
    const file = event.target.files[0]
    if (file) {
      const zip = new JSZip()
      const loadedZip = await zip.loadAsync(file)
      const newPatients = []

      for (const filename of Object.keys(loadedZip.files)) {
        if (filename.endsWith('.json')) {
          const fileContent = await loadedZip.files[filename].async('string')
          const patientData = JSON.parse(fileContent)
          newPatients.push(...patientData)
        }
      }

      setPatients(prev => [...prev, ...newPatients])
    }
  }

  const handleImageUpload = event => {
    const files = Array.from(event.target.files)

    // Generate local preview URLs for new images
    const newImages = files.map(file => {
      const localUrl = URL.createObjectURL(file)
      const formData = new FormData()
      formData.append('name', file.name)
      formData.append('uploader', localStorage.getItem('email'))
      formData.append('projectId', id)
      formData.append('patientId', selectedPatientId)
      formData.append('image', file)

      const requestId = patientService.uploadImage(
        formData,
        id,
        selectedPatientId
      )

      return {
        _id: requestId,
        name: file.name,
        localUrl,
        file,
        isUnsaved: true
      }
    })

    setImages(prevImages => [...prevImages, ...newImages])
  }
  const handleRemoveImage = imageId => {
    setImages(prevImages => prevImages.filter(image => image._id !== imageId))

    // If it's an already uploaded image, queue it for deletion
    patientService.removeImage(id, selectedPatientId, imageId)
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedPatient = patients.find(
    patient => patient._id === selectedPatientId
  )

  return (
    <div className='flex flex-col md:flex-row gap-5'>
      {/* Patient Management Container */}
      <section className='bg-white rounded-lg p-5 shadow-md w-96'>
        <h3 className='text-primary text-lg font-bold mb-4'>Patients</h3>

        <input
          type='text'
          placeholder='Search patients by name...'
          className='w-full mb-4 px-3 py-2 border rounded-md'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className='h-64 overflow-y-auto'>
          {filteredPatients.map(patient => (
            <div
              key={patient._id}
              className={`flex justify-between items-center bg-gray-50 p-3 mb-3 rounded-md shadow-sm cursor-pointer ${
                selectedPatientId === patient._id ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedPatientId(patient._id)}
            >
              <p className='text-gray-700 font-medium'>{patient.name}</p>
              <button
                className='bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition'
                onClick={e => {
                  e.stopPropagation()
                  handleRemovePatient(patient._id)
                }}
              >
                <img src={removeIcon} alt='Remove' className='w-5 h-5' />
              </button>
            </div>
          ))}
        </div>

        <button
          className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition w-full mt-3'
          onClick={handleAddPatient}
        >
          Add Patient
        </button>

        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          accept='.json'
          onChange={handleImportPatients}
        />
        <label
          onClick={() => fileInputRef.current.click()}
          className='flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-3 cursor-pointer'
        >
          Import Patients
          <img src={fileIcon} alt='Import' className='w-4 h-4' />
        </label>

        <input
          type='file'
          ref={zipInputRef}
          className='hidden'
          accept='.zip'
          onChange={handleZipUpload}
        />
        <label
          onClick={() => zipInputRef.current.click()}
          className='flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-3 cursor-pointer'
        >
          Upload ZIP File
          <img src={fileIcon} alt='Upload ZIP' className='w-4 h-4' />
        </label>
      </section>

      {/* Patient Images Container */}
      <section className='bg-white rounded-lg p-5 shadow-md w-96 flex flex-col'>
        <h3 className='text-primary text-lg font-bold mb-4'>
          {selectedPatient
            ? `${selectedPatient.name} Images`
            : 'Select a Patient'}
        </h3>

        {selectedPatient && (
          <div className='flex flex-col flex-grow'>
            <div className='h-64 overflow-y-auto mt-4'>
              {images.length > 0 ? (
                images.map(image => (
                  <div
                    key={image._id}
                    className='flex items-center justify-between bg-gray-50 p-3 mb-3 rounded-md shadow-sm'
                  >
                    <img
                      src={image.localUrl || imageUrls[image._id]}
                      alt={image.name}
                      className='w-16 h-16 rounded-md object-cover'
                    />
                    <div className='flex-grow px-3 min-w-0'>
                      <p className='truncate text-gray-700'>{image.name}</p>
                    </div>
                    {/* Remove Button */}
                    <button
                      className='flex-shrink-0 bg-red-600 text-white p-2 w-10 h-10 rounded-md hover:bg-red-700 transition flex items-center justify-center'
                      onClick={() => handleRemoveImage(image._id)}
                    >
                      <img src={removeIcon} alt='Remove' className='w-5 h-5' />
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>No images uploaded.</p>
              )}
            </div>

            <input
              type='file'
              ref={imageInputRef}
              className='hidden'
              accept='image/*'
              multiple
              onChange={handleImageUpload}
            />
            <label
              onClick={() => imageInputRef.current.click()}
              className='flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition mt-auto cursor-pointer'
            >
              Upload Images
              <img src={fileIcon} alt='Upload' className='w-4 h-4' />
            </label>
          </div>
        )}
      </section>
    </div>
  )
}

export default Patients
