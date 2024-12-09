import React, { useState } from "react";

function AssignDoctor({ assignedDoctors = [], setAssignedDoctors }) {
  // Default to empty array
  const [doctorEmail, setDoctorEmail] = useState("");

  const handleAddDoctor = () => {
    if (doctorEmail && !assignedDoctors.includes(doctorEmail)) {
      setAssignedDoctors([...assignedDoctors, doctorEmail]);
      setDoctorEmail("");
    }
  };

  const handleRemoveDoctor = (email) => {
    setAssignedDoctors(assignedDoctors.filter((doctor) => doctor !== email));
  };

  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-md">
      <h3 className="text-primary text-lg font-bold mb-4">
        Assign Project to Doctors
      </h3>

      <div className="flex gap-3 mb-5 items-center">
        <input
          type="email"
          value={doctorEmail}
          placeholder="Enter doctor's email"
          onChange={(e) => setDoctorEmail(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
          onClick={handleAddDoctor}
        >
          Add Doctor
        </button>
      </div>

      {/* List of assigned doctors */}
      <ul className="list-none p-0">
        {assignedDoctors.map((email, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-md"
          >
            <span>{email}</span>
            <button
              className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition"
              onClick={() => handleRemoveDoctor(email)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AssignDoctor;
