import React, { useState } from 'react';

function AssignDoctor({ assignedDoctors = [], setAssignedDoctors }) { // Default to empty array
  const [doctorEmail, setDoctorEmail] = useState('');

  const handleAddDoctor = () => {
    if (doctorEmail && !assignedDoctors.includes(doctorEmail)) {
      setAssignedDoctors([...assignedDoctors, doctorEmail]);
      setDoctorEmail('');
    }
  };

  const handleRemoveDoctor = (email) => {
    setAssignedDoctors(assignedDoctors.filter((doctor) => doctor !== email));
  };

  return (
    <section className="section">
      <h3>Assign Project to Doctors</h3>

      <div className="assign-doctor-input">
        <input
          type="email"
          value={doctorEmail}
          placeholder="Enter doctor's email"
          onChange={(e) => setDoctorEmail(e.target.value)}
        />
        <button className='in-page-buttons' onClick={handleAddDoctor}>Add Doctor</button>
      </div>

      {/* List of assigned doctors */}
      <ul className="assigned-doctors-list">
        {assignedDoctors.map((email, index) => (
          <li key={index} className="doctor-entry">
            <span>{email}</span>
            <button className='remove-button' onClick={() => handleRemoveDoctor(email)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AssignDoctor;
