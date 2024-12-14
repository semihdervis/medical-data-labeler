import axios from 'axios';
const API_BASE_URL = 'http://localhost:3001';

class PatientService {
  constructor() {
    this.requestQueue = [];
    this.imageQueue = new Map();
    this.patientQueue = new Map();
    this.isProcessing = false;
  }

  async handleImmediate(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  removeFromPatientQueue(requestId) {
    return this.patientQueue.delete(requestId);
  }

  removeFromImageQueue(requestId) {
    return this.imageQueue.delete(requestId);
  }

  getQueuedUploads() {
    return Array.from(this.imageQueue.entries()).map(([id, data]) => ({
      ...data,
    }));
  }

  addToQueue(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift();
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  }

  async sendRequests() {
    if (this.isProcessing) return false;

    this.isProcessing = true;
    let allSuccessful = true;

    // Process patient queue entries first, hold the response ids, match them with image queue entries
    const patientQueueEntries = Array.from(this.patientQueue.entries());
    const patientResponseIds = new Map(); // Map to store patientId and responseId

    for (const [patientId, { requestFn }] of patientQueueEntries) {
      try {
        const result = await requestFn();
        patientResponseIds.set(patientId, result.data._id);
        this.patientQueue.delete(patientId);
      } catch (error) {
        console.error('Error processing patient request:', error);
        allSuccessful = false;
      }
    }

    // Process image queue entries
    const imageQueueEntries = Array.from(this.imageQueue.entries());
    for (const [imageId, { requestFn, formData }] of imageQueueEntries) {
      try {
        // Update formData with the real patient ID
        const fakePatientId = formData.get('patientId');
        const realPatientId = patientResponseIds.get(fakePatientId);
        if (realPatientId) {
          formData.set('patientId', realPatientId);
        }

        const result = await requestFn();
        this.imageQueue.delete(imageId);
      } catch (error) {
        console.error('Error processing image request:', error);
        allSuccessful = false;
      }
    }

    this.isProcessing = false;
    return allSuccessful;
  }

  getPatients(projectId) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/api/patients/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    );
  }

  addPatient(newPatient) {
    return this.addToQueue(() =>
      axios.post(`${API_BASE_URL}/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    );
  }

  async getPatientImages(projectId, patientId) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/api/images/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    );
  }

  async getImageUrl(imagePath) {
    return this.handleImmediate(() =>
      axios.get(`${API_BASE_URL}/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      })
    );
  }

  addToPatientQueue(newPatient, projectId) {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    const requestId = `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const requestFn = () =>
      axios.post(`${API_BASE_URL}/api/patients`, newPatient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

    this.patientQueue.set(requestId, {
      requestFn,
      newPatient,
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
          'Content-Type': 'multipart/form-data',
        },
      });

    this.imageQueue.set(requestId, {
      requestFn,
      formData,
      status: 'pending',
    });

    return requestId;
  }

  uploadImage(formData, projectId, patientId) {
    return this.addToImageQueue(formData, projectId, patientId);
  }

  async removePatientFromQueue(requestId) {
    try {
      const queuedRequest = this.patientQueue.get(requestId);

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`);
        return false;
      }

      this.patientQueue.delete(requestId);
      return true;
    } catch (error) {
      console.error('Error removing patient from queue:', error);
      throw error;
    }
  }

  async removeImageFromQueue(requestId) {
    try {
      const queuedRequest = this.imageQueue.get(requestId);

      if (!queuedRequest) {
        console.warn(`Request with ID ${requestId} not found in queue`);
        return false;
      }

      this.imageQueue.delete(requestId);
      return true;
    } catch (error) {
      console.error('Error removing image from queue:', error);
      throw error;
    }
  }

  removePatient(projectId, patientId) {
    // if in the queue, remove it from the queue, if not queue it for removal
    if (this.patientQueue.has(patientId)) {
      this.removePatientFromQueue(patientId);
    } else {
      this.removePatientService(projectId, patientId);
    }
  }

  removeImage (projectId, patientId, imageId) {
    // if in the queue, remove it from the queue, if not queue it for removal
    if (this.imageQueue.has(imageId)) {
      this.removeImageFromQueue(imageId)
    } else {
      removeImageService(projectId, patientId, imageId)
    }
  }

  async removePatientService(projectId, patientId) {
    return this.addToQueue(() =>
      axios.delete(`${API_BASE_URL}/api/patients/${projectId}/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    );
  }

  async removeImageService(projectId, patientId, imageId) {
    return this.addToQueue(() =>
      axios.delete(`${API_BASE_URL}/api/images/${projectId}/${patientId}/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    );
  }
}

export default new PatientService();