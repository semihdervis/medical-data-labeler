import React, { useState } from 'react'
import axios from 'axios'

function AssignDoctor ({
  allDoctors,
  assignedDoctors = [],
  setAssignedDoctors,
  projectId
}) {
  const [doctorEmail, setDoctorEmail] = useState('')
  const [error, setError] = useState('')

  const handleAddDoctor = async () => {
    const doctorMails = allDoctors.map(doctor => doctor.email)
    if (doctorEmail && !assignedDoctors.includes(doctorEmail)) {
      if (doctorMails.includes(doctorEmail)) {
        setAssignedDoctors([...assignedDoctors, doctorEmail])
        setDoctorEmail('')
        setError('')
      } else {
        console.error('Error adding doctor:', doctorEmail)
        console.error('all:', allDoctors)
        setError(
          'Doctor not found. Please ensure the email is correct and the doctor exists.'
        )
      }
    }
  }

  const handleRemoveDoctor = async doctorEmail => {
    setAssignedDoctors(assignedDoctors.filter(doctor => doctor !== doctorEmail))
  }

  return (
    <section className='bg-white rounded-lg p-5 shadow-md w-full max-w-md'>
      <h3 className='text-primary text-lg font-bold mb-4'>
        Assign Project to Doctors
      </h3>

      <div className='flex gap-3 mb-5 items-center'>
        <input
          type='email'
          value={doctorEmail}
          onChange={e => setDoctorEmail(e.target.value)}
          placeholder="Doctor's email"
          className='flex-1 p-2 border rounded'
        />
        <button
          onClick={handleAddDoctor}
          className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'
        >
          Add
        </button>
      </div>

      {error && <p className='text-red-500'>{error}</p>}

      <ul>
        {assignedDoctors.map(doctor => (
          <li key={doctor} className='flex justify-between items-center mb-2'>
            <span>{doctor}</span>
            <button
              onClick={() => handleRemoveDoctor(doctor)}
              className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition'
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AssignDoctor
