import React, { useState } from 'react';
import './LabelingInterface.css';
import PatientListSidebar from './PatientListSidebar';
import PatientInfoSidebar from './PatientInfoSidebar';
import ImageDisplay from './ImageDisplay';
import ImageLabelsSidebar from './ImageLabelsSidebar';

function LabelingInterface() {
  const [selectedPatient, setSelectedPatient] = useState({
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    healthCondition: 'Hypertensive',
    overallCondition: 'Signs of Inflammation',
    images: ['/behcet-hastaligi4.png', 'img2.jpg']
  });
  const [selectedImage, setSelectedImage] = useState(selectedPatient.images[0]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSelectedImage(patient.images[0]); // Default to the first image
  };

  const handleNextImage = () => {
    const currentIndex = selectedPatient.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % selectedPatient.images.length;
    setSelectedImage(selectedPatient.images[nextIndex]);
  };

  return (
    <div className="labeling-interface">
      <PatientListSidebar onSelectPatient={handleSelectPatient} />
      <PatientInfoSidebar patient={selectedPatient} />
      <ImageDisplay image={selectedImage} onNextImage={handleNextImage} />
      <ImageLabelsSidebar />
    </div>
  );
}

export default LabelingInterface;
