import React from 'react'

function ExportProject ({ currentProject }) {
  const handleExport = () => {
    const projectData = {
      id: currentProject.id,
      name: currentProject.name
      // Add any other project data you want to export
    }

    // Create CSV data
    const csvData = `id,name\n${projectData.id},${projectData.name}`
    const blob = new Blob([csvData], { type: 'text/csv' })

    // Create a download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentProject.name.replace(/\s+/g, '_')}_export.csv`

    // Trigger the download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
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
      >
        Export Project
      </button>
    </section>
  )
}

export default ExportProject
