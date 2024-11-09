import React, { useState } from 'react';
import sorticon from '../icons/sort_icon.png';

function PatientListSidebar({ onSelectPatient }) {
  const patients = [
    { id: 'Patient001', name: 'John Doe', age: 45, gender: 'Male', healthCondition: 'Healthy', overallCondition: 'No Issues', images: ['/behcet-hastaligi4.png', 'behcet_img3.jpg'] },
    { id: 'Patient002', name: 'Jane Smith', age: 32, gender: 'Female', healthCondition: 'Hypertensive', overallCondition: 'Stable', images: ['/behcet_img.jpg', 'behcet_img2.png'] },
    // Add more patients as needed
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
  const [showSortOptions, setShowSortOptions] = useState(false); // State for showing sort options

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort patients based on ID
  const sortedPatients = filteredPatients.sort((a, b) => {
    return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
  });

  const handleClick = (patient) => {
    console.log("Patient selected:", patient); // Log selected patient object
    onSelectPatient(patient);
  };

  return (
    <div className="patient-list-sidebar">
      <h3>Patients</h3>
  
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sort-container">
          <button className='sortbutton' onClick={() => setShowSortOptions((prev) => !prev)}>
            <img src={sorticon} alt="Sort" style={{ width: '20px', height: '20px' }} />
          </button>
          {showSortOptions && (
            <div className="sort-options">
              <button onClick={() => { setSortOrder('asc'); setShowSortOptions(false); }}>
                Ascending ID
              </button>
              <button onClick={() => { setSortOrder('desc'); setShowSortOptions(false); }}>
                Descending ID
              </button>
            </div>
          )}
        </div>
      </div>
  
      <ul>
        {sortedPatients.map((patient) => (
          <li key={patient.id} onClick={() => handleClick(patient)}>
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientListSidebar;
