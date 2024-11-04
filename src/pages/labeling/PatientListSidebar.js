import React, { useState } from 'react';
import sorticon from '../icons/sort_icon.png';

function PatientListSidebar({ onSelectPatient }) {
  const patients = [
    { id: 'Patient001', name: 'John Doe', images: ['img1.jpg', 'img2.jpg'] },
    { id: 'Patient002', name: 'Jane Smith', images: ['img3.jpg', 'img4.jpg'] },
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
          <li key={patient.id} onClick={() => onSelectPatient(patient)}>
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default PatientListSidebar;
