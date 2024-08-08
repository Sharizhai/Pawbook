import React, { useState } from 'react';
import '../css/ThumbnailPicture.css';
import Post_image from "../assets/dog-3724261_640.jpg";
import Post_image_2 from "../assets/dog-4072161_640.jpg";
import { handleImageClick, handleCloseEnlargedImage } from "../utils/imageUtils";

const ThumbnailPicture = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleThumbnailClick = () => {
    handleImageClick(setEnlargedImage, Post_image_2);
  };

  const handleThumbnailDeleteClick = (e) => {
    e.stopPropagation();
    //TODO
    // Ajouter la logique pour la suppression
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
      <div className="thumbnail-picture-container" onClick={handleThumbnailClick}>
        <img src={Post_image_2} alt="Photo de " className="thumbnail-picture" />
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