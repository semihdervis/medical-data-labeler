import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './LabelingInterface.css';
import PatientListSidebar from './PatientListSidebar';
import PatientInfoSidebar from './PatientInfoSidebar';
import ImageDisplay from './ImageDisplay';
import ImageLabelsSidebar from './ImageLabelsSidebar';
import backArrow from '../icons/back_arrow.png';
import saveIcon from '../icons/save.png';

function LabelingInterface() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSave = () => {
    alert("Changes saved!");
  };

  const [patients, setPatients] = useState([
    {
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      healthCondition: 'Hypertensive',
      overallCondition: 'Signs of Inflammation',
      images: ['/behcet-hastaligi4.png', 'img2.jpg']
    },
    // Add more patients here
  ]);

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [selectedImage, setSelectedImage] = useState(selectedPatient.images[0]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSelectedImage(patient.images[0]);
  };

  const handleNextImage = () => {
    const currentIndex = selectedPatient.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % selectedPatient.images.length;
    setSelectedImage(selectedPatient.images[nextIndex]);
  };

  const handlePreviousImage = () => {
    const currentIndex = selectedPatient.images.indexOf(selectedImage);
    const previousIndex = (currentIndex - 1 + selectedPatient.images.length) % selectedPatient.images.length;
    setSelectedImage(selectedPatient.images[previousIndex]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`labeling-interface ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className='label-top-bar'>
        <button className="sidebar-toggle-button" onClick={toggleSidebar}> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>
        </button>
        <div className='container'>
          <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
          <img src={backArrow} alt="Back Arrow" style={{ width: '20px', height: '20px' }} />
             Back to Dashboard</button>
          <button className="save-button" onClick={handleSave}>
          <img src={saveIcon} alt="Save" style={{ width: '20px', height: '20px' }} />
            Save</button>
        </div>
      </div>
      
      
      <PatientListSidebar isOpen={isSidebarOpen} onSelectPatient={handleSelectPatient} />
      <PatientInfoSidebar patient={selectedPatient} />
      <ImageDisplay 
  image={selectedImage} 
  onNextImage={handleNextImage} 
  onPreviousImage={handlePreviousImage} 
/>      <ImageLabelsSidebar />
    </div>
  );
}

export default LabelingInterface;
