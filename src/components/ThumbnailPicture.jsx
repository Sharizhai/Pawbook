import React, { useState } from 'react';
import '../css/ThumbnailPicture.css';
import { handleImageClick, handleCloseEnlargedImage } from "../utils/imageUtils";

const ThumbnailPicture = ({ src, alt, className, onDelete, postIndex, imageIndex }) => {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleThumbnailClick = () => {
      handleImageClick(setEnlargedImage, src);
  };

  const handleThumbnailDeleteClick = (e) => {
      e.stopPropagation(postIndex, imageIndex);
      onDelete(postIndex, imageIndex);
  };

  const EnlargedImage = ({ src, onClose }) => (
      <div className="enlarged-image-overlay" onClick={onClose}>
          <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              Fermer
              <span className="material-symbols-outlined">close</span>
          </button>
          <img src={src} alt="Image agrandie" onClick={(e) => e.stopPropagation()} />
      </div>
  );

  return (
      <>
          <div className={`thumbnail-picture-container ${className || ''}`} 
               onClick={handleThumbnailClick}>
              <img src={src} alt={alt} className="thumbnail-picture" />
              <button className="thumbnail-delete-button" onClick={handleThumbnailDeleteClick}>
                  <span className="material-symbols-outlined">delete</span>
              </button>
          </div>
          {enlargedImage && (
              <EnlargedImage src={enlargedImage} onClose={() => handleCloseEnlargedImage(setEnlargedImage)} />
          )}
      </>
  );
};

export default ThumbnailPicture;