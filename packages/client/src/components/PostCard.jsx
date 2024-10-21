import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'animate.css';

import SettingsButton from "./SettingsButton";
import Button from './Button';
import Profil_image from "../assets/Profil_image_2.png";
import { timeElapsed } from "../utils/timeElapsedUtils";
import AuthService from '../services/auth.service';
import authenticatedFetch from '../services/api.service';
import FloatingMenu from './FloatingMenu';
import useLikeStore from '../stores/likeStore';
import usePostStore from '../stores/postStore';
import '../css/PostCard.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const PostCard = ({ post: initialPost }) => {
  const navigate = useNavigate();
  const posts = usePostStore((state) => state.posts);
  const post = posts.find(p => p._id === initialPost._id) || initialPost;
  const { checkUserLike, addLike, removeLike } = useLikeStore();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const burgerMenuItems = [
    { "label": "Modifier la publication", "action": "updatePost", "className": "" },
    { "label": "Supprimer la publication", "action": "deletePost", "className": "floating-menu-warning-button" }
  ];

  // Vérifier si l'utilisateur courant a liké le post
  useEffect(() => {
    const checkUser = async () => {
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

        const { data: userId } = await verifyLoginResponse.json();
        setCurrentUserId(userId);

        const hasLiked = checkUserLike(post, userId);
        setIsLikedByMe(hasLiked);

      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
      }
    };

    checkUser();
  }, [post.likes, checkUserLike]);

  const handleLikeClick = async () => {
    try {
      if (!currentUserId) {
        navigate("/login");
        return;
      }

      if (!isLikedByMe) {
        await addLike(post, currentUserId);
        setIsLikedByMe(true);
      } else {
        await removeLike(post, currentUserId);
        setIsLikedByMe(false);
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

  const handleFloatingMenuOpen = () => {
    setIsFloatingMenuOpen(true);
  };

  const handleFloatingMenuClose = () => {
    setIsFloatingMenuOpen(false);
  };

  const handleSettingsButtonClick = async (action) => {
    switch (action) {
      case "updatePost":
        // TODO :
        // Ajouter logique pour la modification du post
        break;

      case "deletePost":
        Swal.fire({
          icon: 'warning',
          title: 'Confirmez-vous la suppression de votre pulication ?',
          background: "#DEB5A5",
          position: "center",
          showConfirmButton: true,
          confirmButtonColor: "#A60815",
          confirmButtonText: 'Supprimer',
          showCancelButton: true,
          cancelButtonColor: "#45525A",
          cancelButtonText: 'Annuler',
          color: "#001F31",
          toast: true,
          customClass: {
            background: 'swal-background'
          },
          showClass: {
            popup: `animate__animated
                      animate__fadeInDown
                      animate__faster`
          },
          hideClass: {
            popup: `animate__animated
                      animate__fadeOutUp
                      animate__faster`
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${AuthService.getToken()}`
                },
                credentials: "include",
              });

              if (!verifyLoginResponse.ok) {
                console.error("Utilisateur non connecté")
                navigate("/login");
                return;
              }

              const verifyLoginData = await verifyLoginResponse.json();
              const authorId = verifyLoginData.data;

              const response = await fetch(`${API_URL}/posts/${post._id}/${authorId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });

              if (response.ok) {
                usePostStore.getState().deletePost(post._id);
                
                Swal.fire({
                  icon: 'success',
                  title: 'Votre publication a été supprimée avec succès.',
                  background: "#DEB5A5",
                  position: "top",
                  showConfirmButton: false,
                  color: "#001F31",
                  timer: 5000,
                  toast: true,
                  showClass: {
                    popup: `animate__animated
                      animate__fadeInDown
                      animate__faster`
                  },
                  hideClass: {
                    popup: `animate__animated
                      animate__fadeOutUp
                      animate__faster`
                  }
                });
              } else {
                console.error("La suppression de la publication a échoué");
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Une erreur s\'est produite lors de la suppression de votre compte.',
                  background: "#DEB5A5",
                  confirmButtonColor: "#d33",
                  color: "#001F31",
                  toast: true,
                  showClass: {
                    popup: `animate__animated
                      animate__fadeInDown
                      animate__faster`
                  },
                  hideClass: {
                    popup: `animate__animated
                      animate__fadeOutUp
                      animate__faster`
                  }
                });
              }
            } catch (error) {
              console.error("Erreur lors de la suppression de la publication:", error);
              console.error("La suppression de la publication a échoué");
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite.Veuillez réessayer',
                background: "#DEB5A5",
                confirmButtonColor: "#d33",
                color: "#001F31",
                toast: true,
                showClass: {
                  popup: `animate__animated
                      animate__fadeInDown
                      animate__faster`
                },
                hideClass: {
                  popup: `animate__animated
                      animate__fadeOutUp
                      animate__faster`
                }
              });
            }
          }
        });
        break;
      default:
        console.log("Action not implemented:", action);
    }
    setIsFloatingMenuOpen(false);
  };

  return (
    <>
      <div className="post-main-container">
        <SettingsButton className="post-settings-button"
          onClick={handleFloatingMenuOpen} />
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
            className={`post-button like-button ${isLikedByMe ? 'liked' : ''}`}
            onClick={handleLikeClick}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isLikedByMe ? "'FILL' 1" : "'FILL' 0",
                color: isLikedByMe ? '#85C3BC' : '#001f31'
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

      {isFloatingMenuOpen && (
        <FloatingMenu onClose={handleFloatingMenuClose}>
          {burgerMenuItems.map((item, index) => (
            <Button
              key={index}
              label={item.label}
              onClick={() => handleSettingsButtonClick(item.action)}
              className={item.className}
            />
          ))}
        </FloatingMenu>
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