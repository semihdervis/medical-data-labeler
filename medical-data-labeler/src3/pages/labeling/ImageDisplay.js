import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageDisplay.css';

function ImageDisplay({ image, onNextImage }) {
  const displayImage = image || '/logo192.png';

  //I took the save button from here and put it in LabelingInterFace.js

  return (
    <div className="image-display">
      <img src={displayImage} alt="Patient Medical" />
      <button onClick={onNextImage} className="next-image-button">
        Next Image
      </button>
    </div>
  );
}

export default ImageDisplay;
