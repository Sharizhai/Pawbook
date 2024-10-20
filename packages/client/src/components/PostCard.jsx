import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png";
import { timeElapsed } from "../utils/timeElapsedUtils";
import AuthService from '../services/auth.service';
import '../css/PostCard.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const PostCard = ({ post: initialPost }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Vérifier si l'utilisateur courant a liké le post
  useEffect(() => {
    const checkUserLike = async () => {
      try {
        const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AuthService.getToken()}`
          },
          credentials: "include",
        });

        if (!verifyLoginResponse.ok) return;

        const { data: currentUserId } = await verifyLoginResponse.json();
        // Vérifier si l'ID de l'utilisateur est dans le tableau des likes du post
        setIsPostLiked(post.likes.some(likeId => likeId === currentUserId));
      } catch (error) {
        console.error("Erreur lors de la vérification du like:", error);
      }
    };

    checkUserLike();
  }, [post.likes]);

  // Gérer le clic sur le bouton like
  const handleLikeClick = async () => {
    try {
      const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthService.getToken()}`
        },
        credentials: "include",
      });

      if (!verifyLoginResponse.ok) {
        navigate("/login");
        return;
      }

      const { data: currentUserId } = await verifyLoginResponse.json();

      if (isPostLiked) {
        // Supprimer le like
        const response = await fetch(`${API_URL}/likes/${post._id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ authorId: currentUserId }),
          credentials: "include"
        });

        if (response.ok) {
          setPost(prevPost => ({
            ...prevPost,
            likes: prevPost.likes.filter(likeId => likeId !== currentUserId)
          }));
          setIsPostLiked(false);
        }
      } else {
        // Ajouter le like
        const response = await fetch(`${API_URL}/likes/register`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            authorId: currentUserId,
            postId: post._id
          }),
          credentials: "include"
        });

        if (response.ok) {
          setPost(prevPost => ({
            ...prevPost,
            likes: [...prevPost.likes, currentUserId]
          }));
          setIsPostLiked(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    }
  };

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
            <img src={Profil_image} alt="Profile picture" className="bio-profil-picture" />
          </div>
          <div className="post-name-and-time-container">
            <p className="post-name-and-firstname">{post.authorId?.firstName} {post.authorId?.name}</p>
            <span className="post-time">{post.createdAt ? timeElapsed(new Date(post.createdAt)) : ''}</span>
          </div>
        </div>

        <div className="post-content">
          {post.textContent && (
            <p className="post-text-content">{post.textContent}</p>
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
          <button 
            className={`post-button like-button ${isPostLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
          >
            <span 
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isPostLiked ? "'FILL' 1" : "'FILL' 0",
                color: isPostLiked ? '#85C3BC' : '#001f31'
              }}
            >
              favorite
            </span>
            {post.likes.length > 0 && (
              <span className="like-count">({post.likes.length})</span>
            )}
          </button>
          <button className="post-button comment-button">
            <span className="material-symbols-outlined">mode_comment</span>
            Comment
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
        Close
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="enlarged-image-container">
        {isPreviousAvailable && (
          <button className="chevron-button chevron-left" onClick={handlePreviousClick}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        )}
        <img src={images[currentIndex]} alt="Enlarged image" onClick={(e) => e.stopPropagation()} />
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