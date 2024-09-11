import React, { useState } from 'react';
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png";
import { timeElapsed } from "../utils/timeElapsedUtils";
import '../css/PostCard.css';

const PostCard = ({ post }) => {
  const postDate = new Date(post.createdAt);
  const actualTimeElapsed = timeElapsed(postDate);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImagePostClick = (index) => {
    setEnlargedImage({
      images: post.images,
      currentIndex: index,
    });
  };

  const handleCloseEnlargedImagePost = () => {
    setEnlargedImage(null);
  };

  const handlePreviousImagePost = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.images.length - 1 : prevIndex - 1));
  };

  const handleNextImagePost = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <div className="post-main-container">
        <SettingsButton className="post-settings-button" />
        <div className="post-profil-and-time">
          <div className="post-profil-picture-container">
            <img src={Profil_image} alt="Image de profil de " className="bio-profil-picture" />
          </div>
          <div className="post-name-and-time-container">
            <p className="post-name-and-firstname">{post.user.firstName} {post.user.lastName}</p>
            <span className="post-time">{actualTimeElapsed}</span>
          </div>
        </div>
        <div className="post-content">
          {post.content && (
            <p className="post-text-content">{post.content}</p>
          )}
          {post.images && post.images.length > 0 && (
            <div className={`post-images-grid ${post.images.length === 1 ? 'one-image' : post.images.length === 2 ? 'two-images' : ''}`}>
              {post.images.slice(0, 3).map((image, index) => (
                <div className="post-image-content" key={index} onClick={() => handleImagePostClick(index)}>
                  <img src={image} alt={`Post image ${index}`} />
                  {index === 2 && post.images.length > 3 && (
                    <div className="post-image-overlay" onClick={(e) => { e.stopPropagation(); handleImagePostClick(3); }}>
                      +{post.images.length - 3}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="post-buttons-container">
          <button className="post-button like-button">
            <span className="material-symbols-outlined">favorite</span>
            Aimer
          </button>
          <button className="post-button comment-button">
            <span className="material-symbols-outlined">mode_comment</span>
            Commenter
          </button>
        </div>
      </div>
      {enlargedImage && (
        <EnlargedImage
          images={post.images}
          currentIndex={currentImageIndex}
          onClose={handleCloseEnlargedImagePost}
          onPrevious={handlePreviousImagePost}
          onNext={handleNextImagePost}
          setCurrentImageIndex={setCurrentImageIndex}
      />
      )}
    </>
  );
};

const EnlargedImage = ({ images, currentIndex, onClose, onPrevious, onNext, setCurrentImageIndex }) => {
  const isPreviousAvailable = currentIndex > 0;
  const isNextAvailable = currentIndex < images.length - 1;

  const handlePreviousClick = (e) => {
    e.stopPropagation();
    if (isPreviousAvailable) {
      onPrevious();
    }
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    if (isNextAvailable) {
      onNext();
    }
  };

  return (
    <div className="enlarged-image-overlay" onClick={onClose}>
      <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        Fermer
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="enlarged-image-container">
        {isPreviousAvailable && (
          <button className="chevron-button chevron-left" onClick={handlePreviousClick}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        )}
        <img src={images[currentIndex]} alt="Image agrandie" onClick={(e) => e.stopPropagation()} />
        {isNextAvailable && (
          <button className="chevron-button chevron-right" onClick={handleNextClick}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </div>
      <div className="navigation-dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`navigation-dot ${index === currentIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;