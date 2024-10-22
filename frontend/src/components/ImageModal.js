// src/components/ImageModal.js
import React from 'react';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={imageSrc} alt="Enlarged view" />
      </div>
    </div>
  );
};

export default ImageModal;
