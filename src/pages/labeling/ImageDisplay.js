import React from 'react';

function ImageDisplay({ image, onNextImage }) {
  const displayImage = image || '/behcet-hastaligi4.png'; // Use the provided image or default to logo192.png

  return (
    <div className="image-display">
      <img src={displayImage} alt="Patient Medical" />
      <button onClick={onNextImage}>Next Image</button>
    </div>
  );
}

export default ImageDisplay;
