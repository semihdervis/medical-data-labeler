// src/components/ImageDisplay.js
import React, { useState } from 'react';
import ImageModal from './ImageModal';

const ImageDisplay = ({ images, currentIndex, handleNext, handlePrev, selectedPerson }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="image-section">
      {images.length > 0 ? (
        <div className="image-container">
          <img
            src={`http://localhost:5000/dataset/${selectedPerson}/${images[currentIndex]}`}
            alt={images[currentIndex]}
            onClick={handleImageClick} // Add click handler
            style={{ cursor: 'pointer' }} // Change cursor to indicate clickability
          />
        </div>
      ) : (
        <p>No images available for {selectedPerson}</p>
      )}

      {images.length > 0 && (
        <div className="buttons">
          <button onClick={handlePrev}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Modal for enlarged image */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={`http://localhost:5000/dataset/${selectedPerson}/${images[currentIndex]}`} // Pass current image src
      />
    </div>
  );
};

export default ImageDisplay;
