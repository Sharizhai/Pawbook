import React from 'react';

import Profil_image from "../assets/Profil_image_2.png";
import MoreButton from "./MoreButton";

import '../css/FollowCard.css';

const FollowCard = ({user}) => {
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

            <MoreButton className="followcard-more-button"/>
        </div>
    </>
  );
};

export default FollowCard;