import React, { useState } from 'react';
import './ImageDisplay.css';

function ImageDisplay({ image, onNextImage }) {
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
      <button onClick={onNextImage} className="next-image-button">
        Next Image
      </button>

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
