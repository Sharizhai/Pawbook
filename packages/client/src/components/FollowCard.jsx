import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import floatingMenusData from "../data/floatingMenusData.json"
import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import Button from './Button';
import MoreButton from "./MoreButton";
import FloatingMenu from './FloatingMenu';

import '../css/FollowCard.css';

const FollowCard = ({ user, onFollowChange }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlUserId  } = useParams();
  const isFollowers = location.pathname.startsWith("/followers");

  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const menuItems = isFollowers
    ? floatingMenusData.followPages.followers
    : floatingMenusData.followPages.follows;

  const handleFloatingMenuOpen = () => {
    setIsFloatingMenuOpen(true);
  };

  const handleFloatingMenuClose = () => {
    setIsFloatingMenuOpen(false);
  };

  const handleUnfollow = async () => {
    try {
      //TODO : add toast pour confirmer la suppression. Si ok => delete et refresh la page, si pas ok, return
        const deleteResponse = await authenticatedFetch(`${API_URL}/follows/${urlUserId}/${user._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!deleteResponse.ok) {
          throw new Error('Erreur lors de la suppression du follow');
        }

        // Appeler la fonction de callback pour mettre à jour la liste parent
        if (onFollowChange) {
          onFollowChange();
        }
    } catch (error) {
      //TODO : add toast
    }
  };

  const handleSettingsButtonClick = async (action) => {
    switch (action) {
      case "seeProfile":
        navigate(`/profile/${user._id}`);
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

      case "unfollow":
        await handleUnfollow();
        break;

      default:
        console.log("Action not implemented:", action);
    }
    setIsFloatingMenuOpen(false);
  };

  return (
    <>
      <div className="followcard-main-container">
        <div className="followcard-left-content">
          <div className="followcard-profil-picture-container">
            <img
              className="followcard-profil-picture"
              src={user.profileImage || Profil_image}
              alt={`Image de profil de ${user.name} ${user.firstName}`}
            />
          </div>

          <span className="followcard-profil-name">
            {user.name} {user.firstName}
          </span>
        </div>

        <MoreButton className="followcard-more-button"
          onClick={handleFloatingMenuOpen} />

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
      </div>
    </>
  );
};

export default FollowCard;