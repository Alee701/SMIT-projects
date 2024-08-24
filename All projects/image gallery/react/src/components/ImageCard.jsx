import React from 'react';

const ImageCard = ({ image, onClick }) => {
  return (
    <div className="image-card" onClick={onClick}>
      <img src={image.src} alt={image.title} />
      <div className="image-card-title">{image.title}</div>
    </div>
  );
};

export default ImageCard;
