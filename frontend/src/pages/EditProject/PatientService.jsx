import axios from 'axios'
const API_BASE_URL = 'http://localhost:3001'

class PatientService {
  constructor () {
    this.requestQueue = []
    this.isProcessing = false
  }
  async queueRequest (requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject })
      this.processQueue()
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
  addToQueue (requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject })
    })
  }

  // Method to manually trigger processing of the queue
  async sendRequests () {
    if (this.isProcessing) return false

    this.isProcessing = true
    let allSuccessful = true

    while (this.requestQueue.length > 0) {
      console.log('Processing request: ', this.requestQueue[0])
      const { requestFn, resolve, reject } = this.requestQueue.shift()
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        reject(error)
        allSuccessful = false
      }
    }

    this.isProcessing = false
    return allSuccessful
  }

  // Existing methods now use addToQueue instead of queueRequest
  getPatients (projectId) {
    return this.queueRequest(() =>
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

  removePatient (projectId, patientId) {
    return this.addToQueue(() =>
      axios.delete(`${API_BASE_URL}/api/patients/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  // Images API methods
  async getPatientImages (projectId, patientId) {
    return this.queueRequest(() =>
      axios.get(`${API_BASE_URL}/api/images/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    )
  }

  async getImageUrl (imagePath) {
    return this.queueRequest(() =>
      axios.get(`${API_BASE_URL}/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      })
    )
  }

  uploadImages (formData) {
    return this.addToQueue(() =>
      axios.post(`${API_BASE_URL}/api/images/upload-multiple`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
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
