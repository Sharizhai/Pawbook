import React from 'react';

import Follow_profil_img from "../assets/happy-1836445_640.jpg"
import MoreButton from "./MoreButton";

import '../css/FollowCard.css';

const FollowCard = () => {
  return (
    <>
        <div className="followcard-main-container">
            <div className="followcard-left-content">
            <div className="followcard-profil-picture-container">
                <img src={Follow_profil_img} alt="Image de profil de " className="followcard-profil-picture" />
            </div>

            <span className="followcard-profil-name">
                John Doe     
            </span>
            </div>

            <MoreButton className="followcard-more-button"/>
        </div>
    </>
  );
};

export default FollowCard;