import React, { useState } from 'react';
import './ImageDisplay.css';
import previousIcon from '../icons/previous.png';
import nextIcon from '../icons/next.png';

function ImageDisplay({ image, onNextImage, onPreviousImage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayImage = image || '/logo192.png';

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="image-display">
      <img src={displayImage} alt="Patient Medical" onClick={handleImageClick} />
      <div className="image-navigation">
        <button onClick={onPreviousImage} className="nav-button">
        <img src={previousIcon} alt="Previous" style={{ width: '20px', height: '20px' }} />
        </button>
        <button onClick={onNextImage} className="nav-button">
        <img src={nextIcon} alt="Next" style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={displayImage} alt="Enlarged View" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageDisplay;
