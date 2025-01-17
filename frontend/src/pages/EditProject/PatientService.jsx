import axios from 'axios'

const isServer = import.meta.env.VITE_SERVER === 'true'
const API_BASE_URL = isServer
  ? import.meta.env.VITE_API_BASE_URL_REMOTE
  : import.meta.env.VITE_API_BASE_URL_LOCAL

class PatientService {
  constructor () {
    this.requestQueue = []
    this.imageQueue = new Map()
    this.patientQueue = new Map()
    this.isProcessing = false
    this.deleteQueue = new Set()
  }

  async handleImmediate (requestFn) {
    try {
      const result = await requestFn()
      return result
    } catch (error) {
      throw error
    }
  }

  removeFromPatientQueue (requestId) {
    return this.patientQueue.delete(requestId)
  }

  removeFromImageQueue (requestId) {
    return this.imageQueue.delete(requestId)
  }

  getQueuedUploads () {
    return Array.from(this.imageQueue.entries()).map(([id, data]) => ({
      ...data
    }))
  }

  addToQueue (requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject })
      // this.processQueue()
    })
  }

  async processQueue () {
    if (this.isProcessing) return
    let allSuccessful = true
    this.isProcessing = true
    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift()
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        console.error('Error processing request:', error)
        reject(error)
        allSuccessful = false
      }
    }

    this.isProcessing = false
    return allSuccessful
  }

  async sendRequests () {
    if (this.isProcessing) return false

    this.isProcessing = true
    let allSuccessful = true

    // Process patient queue entries first, hold the response ids, match them with image queue entries
    const patientQueueEntries = Array.from(this.patientQueue.entries())
    const patientResponseIds = new Map() // Map to store patientId and responseId

    for (const [patientId, { requestFn }] of patientQueueEntries) {
      try {
        const result = await requestFn()
        patientResponseIds.set(patientId, result.data._id)
        this.patientQueue.delete(patientId)
      } catch (error) {
        console.error('Error processing patient request:', error)
        allSuccessful = false
      }
    }

    // Process image queue entries
    const imageQueueEntries = Array.from(this.imageQueue.entries())
    for (const [imageId, { requestFn, formData }] of imageQueueEntries) {
      try {
        // Update formData with the real patient ID
        const fakePatientId = formData.get('patientId')
        console.log('fakePatientId', fakePatientId)
        const realPatientId = fakePatientId.startsWith('patient-')
          ? patientResponseIds.get(fakePatientId)
          : fakePatientId
        if (realPatientId) {
          formData.set('patientId', realPatientId)
          const result = await requestFn()
        }
        this.imageQueue.delete(imageId)
      } catch (error) {
        console.error('Error processing image request:', error)
        allSuccessful = false
      }
    }

    this.isProcessing = false

    return this.processQueue()
  }

  getPatients (projectId) {
    return this.handleImmediate(() =>
      axios.get(`/api/patients/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  addPatient (newPatient) {
    return this.addToQueue(() =>
      axios.post(`/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  uploadZip (formData, projectId) {
    return this.handleImmediate(() =>
      axios.post(`/api/projects/${projectId}/import`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  async getPatientImages (projectId, patientId) {
    try {
      const response = await axios.get(
        `/api/images/${projectId}/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (!response.data) {
        console.error('No data in response:', response)
        return []
      }

      const images = response.data
      const imagesToDelete = new Set(this.imageQueue.keys())

      const filteredImages = images.filter(
        image => !this.deleteQueue.has(image._id)
      )

      return filteredImages
    } catch (error) {
      console.error('Error fetching patient images:', error)
      throw error
    }
  }

  async getImageUrl (imagePath) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      })
    )
  }

  addToPatientQueue (newPatient, projectId) {
    if (!projectId) {
      throw new Error('Project ID is required')
    }

    const requestId = `patient-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`

    const requestFn = () =>
      axios.post(`/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

    this.patientQueue.set(requestId, {
      requestFn,
      newPatient,
      status: 'pending'
    })

    return requestId
  }

  addToImageQueue (formData, projectId, patientId) {
    if (!projectId || !patientId) {
      throw new Error('Project ID and Patient ID are required')
    }

    const requestId = `img-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`

    const requestFn = () =>
      axios.post(`/api/images/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

    this.imageQueue.set(requestId, {
      requestFn,
      formData,
      status: 'pending'
    })

    return requestId
  }

  uploadImage (formData, projectId, patientId) {
    return this.addToImageQueue(formData, projectId, patientId)
  }

  async removePatientFromQueue (requestId) {
    try {
      const queuedRequest = this.patientQueue.get(requestId)

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`)
        return false
      }

      this.patientQueue.delete(requestId)
      return true
    } catch (error) {
      console.error('Error removing patient from queue:', error)
      throw error
    }
  }

  async removeImageFromQueue (requestId) {
    try {
      const queuedRequest = this.imageQueue.get(requestId)

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`)
        return false
      }

      this.imageQueue.delete(requestId)
      return true
    } catch (error) {
      console.error('Error removing image from queue:', error)
      throw error
    }
  }

  removePatient (projectId, patientId) {
    // if in the queue, remove it from the queue, if not queue it for removal
    if (this.patientQueue.has(patientId)) {
      this.removePatientFromQueue(patientId)
    } else {
      this.removePatientService(projectId, patientId)
    }
  }

  async removeImageService (projectId, patientId, imageId) {
    this.deleteQueue.add(imageId)
    return this.addToQueue(() =>
      axios.delete(`/api/images/${projectId}/${patientId}/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  removeImage (projectId, patientId, imageId) {
    // if in the queue, remove it from the queue, if not queue it for removal
    if (this.imageQueue.has(imageId)) {
      this.removeImageFromQueue(imageId)
    } else {
      this.removeImageService(projectId, patientId, imageId)
    }
  }

  async removePatientService (projectId, patientId) {
    return this.addToQueue(() =>
      axios.delete(`/api/patients/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }
}

export default new PatientService()
