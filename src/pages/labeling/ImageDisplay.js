import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageDisplay.css';

function ImageDisplay({ image, onNextImage }) {
  const navigate = useNavigate();
  const displayImage = image || '/logo192.png';

  const handleSave = () => {
    // Implement save functionality here
    alert("Changes saved!");
  };

  return (
    <div className="image-display">
      <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
      <img src={displayImage} alt="Patient Medical" />
      <button onClick={onNextImage} className="next-image-button">
        Next Image
      </button>
    </div>
  );
}

export default ImageDisplay;
