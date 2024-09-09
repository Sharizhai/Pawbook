import React, { useState } from 'react';
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png";
import { timeElapsed } from "../utils/timeElapsedUtils";
import { handleImageClick, handleCloseEnlargedImage } from "../utils/imageUtils";
import '../css/PostCard.css';

const PostCard = ({ post }) => {
    const postDate = new Date(post.createdAt);
    const actualTimeElapsed = timeElapsed(postDate);
    const [enlargedImage, setEnlargedImage] = useState(null);

    const handleImagePostClick = (imageUrl) => {
        handleImageClick(setEnlargedImage, imageUrl);
    };

    const handleCloseEnlargedImagePost = () => {
        handleCloseEnlargedImage(setEnlargedImage);
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
                        <div className="post-image-content" onClick={() => handleImagePostClick(post.images[0])}>
                            <img src={post.images[0]} alt="Contenu du post" />
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
                <EnlargedImage src={enlargedImage} onClose={handleCloseEnlargedImagePost} />
            )}
        </>
    );
};

export default PostCard;