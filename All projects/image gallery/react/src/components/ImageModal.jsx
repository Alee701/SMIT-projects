import React from 'react';

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="image-modal">
      <span className="image-modal-close" onClick={onClose}>&times;
      </span>
      <img src={image.src} alt={image.title} />
      <div className="image-modal-title">{image.title}</div>
      <div className="image-modal-description">{image.description}</div>
    </div>
  );
};

export default ImageModal;
