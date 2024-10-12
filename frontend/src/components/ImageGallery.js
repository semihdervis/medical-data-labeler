import React from 'react';

function ImageGallery({ images, currentIndex, handlePrev, handleNext, selectedPerson }) {
  return (
    <div className="image-section">
      {images.length > 0 ? (
        <div className="image-container">
          <img
            src={`http://localhost:5000/dataset/${selectedPerson}/${images[currentIndex]}`}
            alt={images[currentIndex]}
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
    </div>
  );
}

export default ImageGallery;
