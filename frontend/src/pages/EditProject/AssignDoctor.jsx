import React, { useState } from "react";
import axios from "axios";

function AssignDoctor({ assignedDoctors = [], setAssignedDoctors, projectId }) {
  const [doctorEmail, setDoctorEmail] = useState("");
  const [error, setError] = useState("");

  const handleAddDoctor = async () => {
    if (doctorEmail && !assignedDoctors.includes(doctorEmail)) {
      try {
        // Add the doctor to the project
        const response = await axios.post(`/api/projects/${projectId}/assign-doctor`, { doctorEmail: doctorEmail }, {// very STRICTLY doctorEmail : doctorEmail, do not ever change it
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setAssignedDoctors([...assignedDoctors, doctorEmail]);
        setDoctorEmail("");
        setError("");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Doctor not found. Please ensure the email is correct and the doctor exists.");
        } else {
          console.error("Error adding doctor:", error);
          setError("Error adding doctor. Please try again.");
        }
      }
    }
  };

  const handleRemoveDoctor = async (doctorEmail) => {
    if (doctorEmail && assignedDoctors.includes(doctorEmail)) {
      try {
        // Remove the doctor from the project
        await axios.post(`/api/projects/${projectId}/remove-doctor`, {
          doctorEmail: doctorEmail
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAssignedDoctors(assignedDoctors.filter((doctor) => doctor !== doctorEmail));
      } catch (error) {
        console.error("Error removing doctor:", error);
      }
    }
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
          onChange={(e) => setDoctorEmail(e.target.value)}
          placeholder="Doctor's email"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddDoctor}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {assignedDoctors.map((doctor) => (
          <li key={doctor} className="flex justify-between items-center mb-2">
            <span>{doctor}</span>
            <button
              onClick={() => handleRemoveDoctor(doctor)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
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