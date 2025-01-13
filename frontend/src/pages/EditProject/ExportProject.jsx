import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

function ExportProject ({ currentProject }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await axios({
        url: `${API_BASE_URL}/api/projects/${currentProject._id}/export`,
        method: 'POST',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Create a download link for the received file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentProject.name.replace(/\s+/g, '_')}_export.zip`

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting project:', error)
      alert('Failed to export project. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className='bg-white rounded-lg p-5 shadow-md w-full max-w-md'>
      <h3 className='text-primary text-lg font-bold mb-4'>Export Project</h3>
      <p className='text-gray-700 mb-3'>
        Export your project data as a CSV file.
      </p>
      <p className='text-gray-700 mb-5'>
        Project to export:{' '}
        <strong className='font-semibold'>{currentProject.name}</strong>
      </p>
      <button
        className='bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-secondary transition'
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Project'}
      </button>
    </section>
  )
}

export default ExportProject
