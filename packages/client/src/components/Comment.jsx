import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import FloatingMenu from "./FloatingMenu";
import Profil_image from "../assets/Profil_image_2.png";
import floatingMenusData from "../data/floatingMenusData.json"
import authenticatedFetch from '../services/api.service';
import MoreButton from "./MoreButton";
import usePostStore from '../stores/postStore';
import Button from './Button';

import styles from "../styles/components/Comment.module.scss";

const Comment = ({ postId, idComment, author, textContent, currentUserId, isAdminMode = false }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');
  const { id: urlUserId } = useParams();

  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const menuItems = isAdminMode
    ? floatingMenusData.comment.admin
    : (currentUserId === author?._id
      ? floatingMenusData.comment.user
      : floatingMenusData.comment.other);

  const handleFloatingMenuOpen = () => {
    setIsFloatingMenuOpen(true);
  };

  const handleFloatingMenuClose = () => {
    setIsFloatingMenuOpen(false);
  };

  const handleSettingsButtonClick = async (action) => {
    switch (action) {
      case "deleteComment":
        Swal.fire({
          icon: 'warning',
          title: 'Confirmez-vous la suppression de votre commentaire ?',
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
              const commentId = idComment;

              console.log(authorId, commentId, postId)

              const response = await authenticatedFetch(`${API_URL}/comments/${postId}/${idComment}/${author}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });

              if (response.ok) {
                // Récupérer le post actuel depuis le store
                const currentPost = usePostStore.getState().posts.find(p => p._id === postId);

                if (currentPost) {
                  // Créer une nouvelle version du post sans le commentaire supprimé
                  const updatedPost = {
                    ...currentPost,
                    comments: currentPost.comments.filter(comment => comment._id !== commentId)
                  };

                  // Mettre à jour le store avec le post mis à jour
                  usePostStore.getState().updatePost(
                    updatedPost,
                    isProfilePage,
                    currentUserId,
                    urlUserId
                  );
                }

                Swal.fire({
                  icon: 'success',
                  title: 'Votre commentaire a été supprimé avec succès.',
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
                console.error("La suppression du commentaire a échoué");
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Une erreur s\'est produite lors de la suppression de votre commentaire.',
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
              console.error("Erreur lors de la suppression du commentaire :", error);
              console.error("La suppression du commentaire a échoué");
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

      case "reportComment":
        // TODO :
        // Ajouter logique pour signaler un commentaire
        break;

      case "reportUser":
        // TODO :
        // Ajouter logique pour signaler un user
        break;

      case "reportUserName":
        // TODO :
        // Ajouter logique pour signaler un nom/pseudo
        break;

      case "reportPicture":
        // TODO :
        // Ajouter logique pour signaler une image
        break;
      case "adminDeleteComment":
        Swal.fire({
          icon: 'warning',
          title: 'Confirmez-vous la suppression de ce commentaire ?',
          background: "#DEB5A5",
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
            const response = await authenticatedFetch(`${API_URL}/comments/admin/${postId}/${idComment}/${author?._id}`, {
              method: "DELETE",
              credentials: "include",
            });
    
            if (response.ok) {
              const currentPost = usePostStore.getState().posts.find(p => p._id === postId);
    
              if (currentPost) {
                const updatedPost = {
                  ...currentPost,
                  comments: currentPost.comments.filter(comment => comment._id !== idComment)
                };
    
                usePostStore.getState().updatePost(
                  updatedPost,
                  isProfilePage,
                  currentUserId,
                  urlUserId
                );
              }
    
              Swal.fire({
                icon: 'success',
                title: 'Commentaire supprimé avec succès',
                background: "#DEB5A5",
                toast: true,
                position: 'top'
              });
            } else {
              throw new Error("Échec de la suppression");
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors de la suppression',
              background: "#DEB5A5",
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

  const getImageUrl = (picturePath) => {
    if (!picturePath) return Profil_image;
    if (picturePath.startsWith('http')) return picturePath;
    if (picturePath === Profil_image) return Profil_image;
    return `${API_URL}/uploads/${picturePath}`;
  };

  return (
    <>
      <div className={styles.commentContainer}>

        <div className={styles.commentProfilPictureContainer}>
          <img src={getImageUrl(author?.profilePicture)} alt={`Image de profil de ${author?.firstName} ${author?.name}`} className={styles.commentProfilPicture} />
        </div>

        <div className={styles.commentNameAndComment}>
          <div className={styles.commentNameFirstname}>
            {author?.firstName} {author?.name}
          </div>

          <div className={styles.commentDisplay}>
            {textContent}
          </div>
        </div>
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

        <MoreButton className={styles.commentMoreButton}
          onClick={handleFloatingMenuOpen} />
      </div>
    </>
  )
}

export default Comment;