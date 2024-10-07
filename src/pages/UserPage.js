import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './UserPage.css'; // Import your CSS

// Sample data for patients
const samplePatients = [
  {
    id: 1,
    name: 'John Doe',
    images: [
        'https://storage.googleapis.com/website-production/uploads/2017/10/stock-photo-guide-cheesy-celebration.jpg',
        'data:image/jpeg;base64,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'
        
    ],
    labels: ['Label A', 'Label B'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    images: [
      'https://via.placeholder.com/200/00FF00/FFFFFF?text=Jane+Image+1',
      'https://via.placeholder.com/200/FFFF00/FFFFFF?text=Jane+Image+2',
    ],
    labels: ['Label C', 'Label D'],
  },
  // Add more sample patients as needed
];

const UserPage = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [hoveredPatient, setHoveredPatient] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    const handlePatientClick = (patient) => {
      setSelectedPatient(patient);
      setCurrentImageIndex(0); // Reset to the first image
    };
  
    const nextImage = () => {
      if (selectedPatient && currentImageIndex < selectedPatient.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    };
  
    const previousImage = () => {
      if (selectedPatient && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    };
  
    return (
      <div className="user-page">
        <div className='sidebar-box'>
        <div className="sidebar">
          <h2>Patients</h2>
          <ul>
            {samplePatients.map((patient) => (
              <li
                key={patient.id}
                onMouseEnter={() => setHoveredPatient(patient)}
                //onMouseLeave={() => setHoveredPatient(null)}
                onClick={() => handlePatientClick(patient)}
              >
                {patient.name}
              </li>
            ))}
          </ul>
        </div>
  
        <div className="preview-sidebar">
          {hoveredPatient && (
            <div>
              <h3>{hoveredPatient.name}'s Image Previews</h3>
              <div className="image-previews">
                {hoveredPatient.images.map((url, index) => (
                  <img key={index} src={url} alt={`preview-${index}`} className="preview-image" />
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
        
  
        <div className="content-area">
          {selectedPatient && (
            <>
              <h2>{selectedPatient.name}'s Details</h2>
              <div className="image-container">
                <img src={selectedPatient.images[currentImageIndex]} alt={`patient-image-${currentImageIndex}`} className="patient-image" />
                <div className="navigation-buttons">
                  <button onClick={previousImage} disabled={currentImageIndex === 0}>
                    Previous
                  </button>
                  <button onClick={nextImage} disabled={currentImageIndex === selectedPatient.images.length - 1}>
                    Next
                  </button>
                </div>
              </div>
              <div className="labels-container">
                <h3>Labels</h3>
                <ul>
                  {selectedPatient.labels.map((label, index) => (
                    <li key={index}>{label}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <div className='rightmost-sidebar'>
            <Link to="/">Go to Home Page</Link>
        </div>
      </div>
    );
  };
  
  export default UserPage;