import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'animate.css';

import floatingMenusData from "../data/floatingMenusData.json"
import SettingsButton from "./SettingsButton";
import Button from './Button';
import Profil_image from "../assets/Profil_image_2.png";
import { timeElapsed } from "../utils/timeElapsedUtils";
import authenticatedFetch from '../services/api.service';
import FloatingMenu from './FloatingMenu';
import useLikeStore from '../stores/likeStore';
import usePostStore from '../stores/postStore';
import PostPanel from './PostPanel';
import Comment from './Comment';
import CommentInput from './CommentInput';
import CommentPanel from './CommentPanel';

import '../css/PostCard.css';

const API_URL = import.meta.env.VITE_BASE_URL;

const PostCard = ({ post: initialPost, isInCommentPanel = false, isAdminMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const posts = usePostStore((state) => state.posts);
  const post = posts.find(p => p._id === initialPost._id) || {
    ...initialPost,
    likes: initialPost.likes || [],
    comments: initialPost.comments || [],
    photoContent: initialPost.photoContent || []
  };
  const { checkUserLike, addLike, removeLike } = useLikeStore();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommentInputVisible, setIsCommentInputVisible] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const { id: urlUserId } = useParams();

  const handleComment = (e) => setComment(e.target.value);
  const toggleCommentInput = () => setIsCommentInputVisible(!isCommentInputVisible);

  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);

  const isProfilePage = location.pathname.startsWith('/profile');

  const menuItems = isAdminMode
    ? floatingMenusData.post.admin
    : (currentUserId === post.authorId?._id
      ? floatingMenusData.post.user
      : floatingMenusData.post.other);

  // Vérifier si l'utilisateur courant a liké le post
  useEffect(() => {
    const checkUser = async () => {
      try {
        const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
          method: "GET",
          credentials: "include",
        });

        if (!verifyLoginResponse.ok) return;

        const { data: userId } = await verifyLoginResponse.json();
        setCurrentUserId(userId);

        if (post && post.likes) {
          const hasLiked = checkUserLike(post, userId);
          setIsLikedByMe(hasLiked);
        }

      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
      }
    };

    checkUser();
  }, [post?.likes, checkUserLike]);

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

  const handleProfileClick = () => {
    if (!post.authorId?._id) {
      Swal.fire({
        icon: "success",
        title: "Ce profil n\'est pas disponible ou a été supprimé.",
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
      return;
    }
    navigate(`/profile/${post.authorId._id}`);
  };

  const handleImagePostClick = (index) => {
    setEnlargedImage({
      images: post.photoContent,
      currentIndex: index,
    });
  };

  const handleCloseEnlargedImagePost = () => {
    setEnlargedImage(null);
  };

  const handlePreviousImagePost = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.photoContent.length - 1 : prevIndex - 1));
  };

  const handleNextImagePost = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === post.photoContent.length - 1 ? 0 : prevIndex + 1));
  };

  const handleFloatingMenuOpen = () => {
    setIsFloatingMenuOpen(true);
  };

  const handleFloatingMenuClose = () => {
    setIsFloatingMenuOpen(false);
  };

  const handleSettingsButtonClick = async (action) => {
    switch (action) {
      case "editPost":
        setIsEditMode(true);
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
                credentials: "include",
              });

              if (!verifyLoginResponse.ok) {
                console.error("Utilisateur non connecté")
                navigate("/login");
                return;
              }

              const verifyLoginData = await verifyLoginResponse.json();
              const authorId = verifyLoginData.data;
              const postId = post._id;

              const response = await authenticatedFetch(`${API_URL}/posts/${postId}/${authorId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });

              if (response.ok) {
                usePostStore.getState().deletePost(postId, false);

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

      case "reportPost":
        // TODO :
        // Ajouter logique pour signaler un post
        break;

      case "reportUser":
        // TODO :
        // Ajouter logique pour signaler un post
        break;

      case "reportUserName":
        // TODO :
        // Ajouter logique pour signaler un post
        break;

      case "reportPicture":
        // TODO :
        // Ajouter logique pour signaler un post
        break;

      case "modifyPost":
        setIsAdminEditMode(true);
        break;

      case "adminDeletePost":
        
        break;
      default:
        console.log("Action not implemented:", action);
    }
    setIsFloatingMenuOpen(false);
  };

  const handleEditClose = async (updatedPost) => {
    if (isAdminEditMode) {
      setIsAdminEditMode(false);
    } else {
      setIsEditMode(false);
    }

    if (updatedPost && currentUserId) {
      await usePostStore.getState().updatePost(
        updatedPost,
        isProfilePage,
        currentUserId,
        urlUserId
      );
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      return;
    }

    if (!currentUserId) {
      navigate("/login");
      return;
    }

    try {
      const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (!verifyLoginResponse.ok) {
        navigate("/login");
        return;
      }

      const { data: authorId } = await verifyLoginResponse.json();

      const response = await authenticatedFetch(`${API_URL}/comments/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          authorId,
          postId: post._id,
          textContent: comment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      //On met à jour le store pour refresh le post avec le nouveau commentaire
      const newComment = await response.json();
      usePostStore.getState().updatePost(
        {
          ...post,
          comments: [...post.comments, {
            _id: newComment.data._id,
            authorId: {
              _id: authorId,
              name: post.authorId.name,
              firstName: post.authorId.firstName
            },
            textContent: comment
          }]
        },
        isProfilePage,
        currentUserId,
        urlUserId
      );

      // Réinitialiser le champ de commentaire
      setComment("");
      setIsCommentInputVisible(false);

      Swal.fire({
        icon: 'success',
        title: 'Votre commentaire a été publié',
        background: "#DEB5A5",
        position: "top",
        showConfirmButton: false,
        color: "#001F31",
        timer: 3000,
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

    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur s\'est produite lors de la publication de votre commentaire',
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
  };

  const handleOpenCommentPanel = () => {
    if (!isInCommentPanel) {
      setIsCommentPanelOpen(true);
    }
  };

  const handleCloseCommentPanel = () => {
    setIsCommentPanelOpen(false);
  };

  const getImageUrl = (picturePath) => {
    if (!picturePath) return Profil_image;
    if (picturePath.startsWith('http')) return picturePath;
    if (picturePath === Profil_image) return Profil_image;
    return `${API_URL}/uploads/${picturePath}`;
  };

  return (
    <>
      <div className="post-main-container">
        <SettingsButton className="post-settings-button"
          onClick={handleFloatingMenuOpen} />
        <div className="post-profil-and-time">
          <div className="post-profil-picture-container">
            <img src={getImageUrl(post.authorId?.profilePicture)} alt={`Image de profil de ${post.authorId?.firstName} ${post.authorId?.name}`} className="bio-profil-picture" />
          </div>
          <div className="post-name-and-time-container">
            <p className="post-name-and-firstname"
              onClick={handleProfileClick}>{post.authorId?.firstName} {post.authorId?.name}</p>
            <span className="post-time">{post.createdAt ? timeElapsed(new Date(post.createdAt)) : ''}</span>
          </div>
        </div>

        <div className="post-content">
          {post.textContent && (
            <p className="post-text-content">{post.textContent}</p>
          )}
          {post.photoContent && post.photoContent.length > 0 && (
            <div className={`post-images-grid ${post.photoContent.length === 1 ? 'one-image' : post.photoContent.length === 2 ? 'two-images' : ''}`}>
              {post.photoContent.slice(0, 3).map((image, index) => (
                <div className="post-image-content" key={index} onClick={() => handleImagePostClick(index)}>
                  <img src={image} alt={`Post image ${index}`} />
                  {index === 2 && post.photoContent.length > 3 && (
                    <div className="post-image-overlay" onClick={(e) => { e.stopPropagation(); handleImagePostClick(3); }}>
                      +{post.photoContent.length - 3}
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
                color: isLikedByMe ? '#CC0129' : '#001f31'
              }}
            >
              favorite
            </span>
            {post.likes?.length > 0 && (
              <span className="like-count">{post.likes.length}</span>
            )}
          </button>

          <button className="post-button comment-button"
            onClick={toggleCommentInput}>
            <span className="material-symbols-outlined">mode_comment</span>
            Commenter
          </button>

          {post.comments?.length > 0 && (
            <button
              className="post-button all-comment-button"
              onClick={handleOpenCommentPanel}
            >
              <span className="comment-count">{post.comments.length}</span>
              {`Commentaire${post.comments.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {isCommentInputVisible && (
          <div className="post-comment-input">
            <CommentInput
              type="text"
              name="comment"
              value={comment}
              onChange={handleComment}
              placeholder="Commenter cette publication"
              onSend={handleCommentSubmit}
            />
          </div>
        )}

        {isInCommentPanel && (
          <div className="post-comments-display">
            {post.comments.map((comment) => (
              <Comment
                key={comment._id}
                postId={post._id}
                idComment={comment._id}
                author={comment.authorId}
                textContent={comment.textContent}
                currentUserId={currentUserId}
                isAdminMode={isAdminMode}
              />
            ))}
          </div>)}

      </div>

      {enlargedImage && (
        <EnlargedImage
          images={post.photoContent}
          currentIndex={currentImageIndex}
          onClose={handleCloseEnlargedImagePost}
          onPrevious={handlePreviousImagePost}
          onNext={handleNextImagePost}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}

      {isFloatingMenuOpen && (
        <FloatingMenu onClose={handleFloatingMenuClose}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              label={item.label}
              onClick={() => handleSettingsButtonClick(item.action)}
              className={item.className}
            />
          ))}
        </FloatingMenu>
      )}

      {isEditMode && (
        <PostPanel
          onClose={handleEditClose}
          isEditing={true}
          post={post}
          isProfilePage={isProfilePage}
        />
      )}

      {isAdminEditMode && (
        <PostPanel
          post={post}
          isEditing={true}
          isAdminMode={true}
          onClose={handleEditClose}
        />
      )}

      {isCommentPanelOpen && (
        <CommentPanel
          post={post}
          onClose={handleCloseCommentPanel}
          isProfilePage={isProfilePage}
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