import axios from 'axios'
const API_BASE_URL = 'http://localhost:3001'

class PatientService {
  constructor () {
    this.requestQueue = []
    this.imageQueue = new Map()
    this.patientQueue = new Map()
    this.isProcessing = false
  }
  async handleImmediate (requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject })
      this.processQueue()
    })
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
    })
  }
  async processQueue () {
    if (this.isProcessing) return

    this.isProcessing = true
    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift()
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    this.isProcessing = false
  }

  // New method to add requests to the queue

  // Method to manually trigger processing of the queue
  async sendRequests () {
    if (this.isProcessing) return false

    this.isProcessing = true
    let allSuccessful = true

    while (this.requestQueue.length > 0) {
      console.log('Processing request: ', this.requestQueue[0])
      const { requestFn } = this.requestQueue.shift()
      try {
        const result = await requestFn()
        console.log('Request successful:', result)
      } catch (error) {
        console.error('Error processing request:', error)
        allSuccessful = false
      }
    }

    const imageQueueEntries = Array.from(this.imageQueue.entries())
    for (const [imageId, { requestFn }] of imageQueueEntries) {
      try {
        const result = await requestFn()
        
        this.imageQueue.delete(imageId)
      } catch (error) {
        console.error('Error processing image request:', error)
      }
    }

    this.isProcessing = false
    return allSuccessful
  }

  // Existing methods now use addToQueue instead of handleImmediate
  getPatients (projectId) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/api/patients/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  addPatient (newPatient) {
    return this.addToQueue(() =>
      axios.post(`${API_BASE_URL}/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }


  // Images API methods
  async getPatientImages (projectId, patientId) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/api/images/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
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

  addToPatientQueue(formData, projectId) {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
  
    const requestId = `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const requestFn = () => 
      axios.post(`${API_BASE_URL}/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
    this.patientQueue.set(requestId, {
      requestFn,
      formData,
      status: 'pending',
    });
  
    return requestId;
  }

  addToImageQueue(formData, projectId, patientId) {
    if (!projectId || !patientId) {
      throw new Error('Project ID and Patient ID are required');
    }
  
    const requestId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const requestFn = () => 
      axios.post(`${API_BASE_URL}/api/images/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
    this.imageQueue.set(requestId, {
      requestFn,
      formData,
      status: 'pending',
    });
  
    return requestId;
  }

  // Update uploadImage method
  uploadImage(formData, projectId, patientId) {
    return this.addToImageQueue(formData, projectId, patientId);
  }

  async removePatientFromQueue (requestId) {
    try {
      // Find the queued request
      const queuedRequest = this.patientQueue.get(requestId)

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`)
        return false
      }

      // Remove from queue
      this.patientQueue.delete(requestId)

      return true
    } catch (error) {
      console.error('Error removing image from queue:', error)
      throw error
    }
  }

  async removeImageFromQueue (requestId) {
    try {
      // Find the queued request
      const queuedRequest = this.imageQueue.get(requestId)

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`)
        return false
      }

      // Remove from queue
      this.imageQueue.delete(requestId)

      return true
    } catch (error) {
      console.error('Error removing image from queue:', error)
      throw error
    }
  } 

  
  removePatient (projectId, patientId) {
    return this.addToQueue(() =>
      axios.delete(`${API_BASE_URL}/api/patients/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  async removeImage (projectId, patientId, imageId) {
    return this.addToQueue(() =>
      axios.delete(
        `${API_BASE_URL}/api/images/${projectId}/${patientId}/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    )
  }
}

export default new PatientService()
