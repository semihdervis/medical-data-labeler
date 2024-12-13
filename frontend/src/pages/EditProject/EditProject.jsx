import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
import ProjectDescription from './ProjectDescription'
import PersonLabels from './PersonLabels'
import ImageLabels from './ImageLabels'
import Patients from './Patients'
import PatientService from './PatientService'
import AssignDoctor from './AssignDoctor'
import RemoveCurrentProject from './RemoveCurrentProject'
import ExportProject from './ExportProject'
import logoutIcon from '../icons/logout.png'
import saveIcon from '../icons/save.png'

function AdminProjectPage () {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeSection, setActiveSection] = useState('description')
  const [projectDescription, setProjectDescription] = useState()
  const [personLabels, setPersonLabels] = useState([])
  const [imageLabels, setImageLabels] = useState([])
  const [patients, setPatients] = useState([])
  const [assignedDoctors, setAssignedDoctors] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [activeButton, setActiveButton] = useState('description')
  const [projectName, setProjectName] = useState()
  const [currentProject, setCurrentProject] = useState(null)
  const [patientSchemaId, setPatientSchemaId] = useState(null)
  const [imageSchemaId, setImageSchemaId] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setCurrentProject(response.data)
        setProjectName(response.data.name)
        setProjectDescription(response.data.description)
      } catch (error) {
        console.error('Error fetching project:', error)
      }
    }

    const fetchLabels = async () => {
      try {
        const response = await axios.get(`/api/labels/schema/project/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const [patientSchema, imageSchema] = response.data
        setPersonLabels(patientSchema.labelData)
        setImageLabels(imageSchema.labelData)
        setPatientSchemaId(patientSchema._id)
        setImageSchemaId(imageSchema._id)
      } catch (error) {
        console.error('Error fetching labels:', error)
      }
    }

    const fetchPatients = async () => {
      try {
        const response = await PatientService.getPatients(id)
        setPatients(response.data)
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    const fetchAssignedDoctors = async () => {
      try {
        const response = await axios.get(`/api/users/doctors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const allDoctors = response.data
        setAllDoctors(allDoctors)
        // Filter doctors who have this project ID in their projects array
        const assignedDoctors = allDoctors.filter(doctor =>
          doctor.projects.includes(id)
        )
        setAssignedDoctors(assignedDoctors.map(doctor => doctor.email))
      } catch (error) {
        console.error('Error fetching assigned doctors:', error)
      }
    }

    fetchProject()
    fetchLabels()
    fetchPatients()
    fetchAssignedDoctors()
  }, [id])

  const handleLogout = () => {
    navigate('/')
  }
  // Assume we have a single project loaded in the editor for simplicity

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put(
        `/api/projects/${id}`,
        {
          name: projectName,
          description: projectDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Project saved', response.data)
    } catch (error) {
      console.error('Error saving project:', error)
    }

    // update person labels
    try {
      const response = await axios.put(
        `/api/labels/schema/${patientSchemaId}`,
        {
          labelData: personLabels
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Person labels saved', response.data)
    } catch (error) {
      console.error('Error saving person labels:', error)
    }

    // update image labels
    try {
      const response = await axios.put(
        `/api/labels/schema/${imageSchemaId}`,
        {
          labelData: imageLabels
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Image labels saved', response.data)
    } catch (error) {
      console.error('Error saving image labels:', error)
    }

    // assign doctors
    try {
      const response = await axios.put(
        `/api/projects/${id}/update-assigns`,
        {
          assignedDoctors: assignedDoctors
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Doctors assigned successfully:', response.data)
    } catch (error) {
      console.error('Error assigning doctors:', error)
    }

    // patient and image requests
    try {
      const allSuccessful = await PatientService.sendRequests()
      if (allSuccessful) {
        console.log('All requests processed successfully')
      } else {
        console.error('Some requests failed')
      }
    } catch (error) {
      console.error('Error processing requests:', error)
    }
  }

  const handleRemoveProject = async projectId => {
    try {
      const response = await axios.delete(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(`Project ${projectId} removed`, response.data)
      navigate('/admin')
    } catch (error) {
      console.error(`Error removing project ${projectId}:`, error)
    }
  }

  const handleExport = () => {
    const projectData = {
      ...currentProject,
      exportDate: new Date().toISOString()
    }
    return projectData
  }

  return (
    <div className='flex h-screen bg-gray-100 admin-project-page'>
      <Sidebar setActiveSection={setActiveSection} />

      <div className='flex-1 p-5 overflow-y-auto flex justify-center items-center'>
        <div className='flex justify-between items-center h-12 bg-primary rounded-lg shadow-md fixed top-0 left-[5px] right-[5px] mt-2.5 ml-1.25 px-4 w-[calc(100%-10px)] z-[1000]'>
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center justify-center mr-2.5 bg-primary hover:bg-secondary text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors ${
              activeButton === 'dashboard-button' ? 'bg-secondary' : ''
            }`}
          >
            <span>&#60; Go to Dashboard</span>
          </button>
          <h1 className='text-white font-bold text-xl'>
            <u>{projectName}</u>
          </h1>{' '}
          <div className='flex items-center justify-between gap-2'>
            <button
              onClick={handleSave}
              className='flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors'
            >
              <img
                src={saveIcon}
                alt='Save'
                className='w-[20px] h-[20px] mr-[3px]'
              />
              Save
            </button>

            <button
              className='flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded cursor-pointer transition-colors'
              onClick={handleLogout}
            >
              <img
                src={logoutIcon}
                alt='Log out'
                className='w-5 h-5 mr-1 mt-1'
              />
              Log Out
            </button>
          </div>
        </div>
        {activeSection === 'description' && (
          <ProjectDescription
            projectName={projectName}
            setProjectName={setProjectName}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
          />
        )}
        {activeSection === 'personLabels' && (
          <PersonLabels
            personLabels={personLabels}
            setPersonLabels={setPersonLabels}
          />
        )}
        {activeSection === 'imageLabels' && (
          <ImageLabels
            imageLabels={imageLabels}
            setImageLabels={setImageLabels}
          />
        )}
        {activeSection === 'patients' && (
          <Patients
            patients={patients}
            setPatients={setPatients}
            patientService={PatientService} // Pass the service as a prop
          />
        )}
        {activeSection === 'assignDoctor' && (
          <AssignDoctor
            allDoctors={allDoctors}
            assignedDoctors={assignedDoctors}
            setAssignedDoctors={setAssignedDoctors}
            projectId={id}
          />
        )}
        {activeSection === 'removeCurrentProject' && (
          <RemoveCurrentProject
            currentProject={currentProject}
            onRemove={handleRemoveProject}
          />
        )}
        {activeSection === 'exportProject' && (
          <ExportProject
            currentProject={currentProject}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  )
}

export default AdminProjectPage
