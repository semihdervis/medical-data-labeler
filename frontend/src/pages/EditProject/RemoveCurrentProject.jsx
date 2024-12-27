import React from 'react'

function RemoveCurrentProject ({ currentProject, onRemove }) {
  const handleConfirmRemove = () => {
    onRemove(currentProject.id) // Calls the parent function to remove the project
  }

  return (
    <section className='bg-white rounded-lg p-5 shadow-md w-full max-w-lg'>
      <h3 className='text-primary text-lg font-bold mb-4'>
        Remove Current Project
      </h3>
      <p className='text-gray-700 mb-5'>
        Are you sure you want to remove the project{' '}
        <strong>{currentProject.name}</strong>?
      </p>
      <button
        className='bg-negative text-white py-2 px-4 rounded-md hover:bg-red-700 transition w-full'
        onClick={handleConfirmRemove}
      >
        Confirm Remove
      </button>
    </section>
  )
}

export default RemoveCurrentProject
