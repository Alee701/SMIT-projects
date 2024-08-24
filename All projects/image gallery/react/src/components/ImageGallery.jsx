import React, { useState } from 'react';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import { images } from '../data';

const ImageGallery = ({ searchTerm }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = images.filter((image) =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="image-gallery">
      {filteredImages.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={() => setSelectedImage(image)}
        />
      ))}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageGallery;
