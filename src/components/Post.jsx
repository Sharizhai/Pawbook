import Button from "./Button";
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png"
import Post_image from "../assets/dog-3724261_640.jpg"
import Post_image_2 from "../assets/dog-4072161_640.jpg"
import React, { useState } from 'react';
import { timeElapsed } from "../utils/timeElapsedUtils";
import '../css/Post.css';

const Post = ({ }) => {
    // Post fictif en attendant le back
    const mockPost = {
        createdAt: new Date(Date.now() - 3600000).toISOString(), // Il y a 1 heure
        user: {
            firstName: 'Jane',
            lastName: 'Doe'
        },
        content: 'Test', // Peut être null ou une chaîne vide si pas de texte
        image: Post_image // Peut être null si pas d'image
    };

    const postDate = new Date(mockPost.createdAt);
    const actualTimeElapsed = timeElapsed(postDate);

    const [enlargedImage, setEnlargedImage] = useState(null);
    const handleImageClick = () => {
        setEnlargedImage(mockPost.image);
    };
    const handleCloseEnlargedImage = () => {
        setEnlargedImage(null);
    };
    const EnlargedImage = ({ src, onClose }) => (
        <div className="enlarged-image-overlay" onClick={onClose}>
            <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                Fermer
                <span class="material-symbols-outlined">
                    close
                </span>
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
                        <p className="post-name-and-firstname">{mockPost.user.firstName} {mockPost.user.lastName}</p>
                        <span className="post-time">{actualTimeElapsed}</span>
                    </div>
                </div>
                <div className="post-content">
                    {mockPost.content && (
                        <p className="post-text-content">{mockPost.content}</p>
                    )}
                    {mockPost.image && (
                        <div className="post-image-content" onClick={handleImageClick}>
                            <img src={mockPost.image} alt="Contenu du post" />
                        </div>
                    )}
                </div>
                <div className="post-buttons-container">
                    <button className="post-button like-button">
                        <span className="material-symbols-outlined">
                            favorite
                        </span>
                        Aimer
                    </button>
                    <button className="post-button comment-button">
                        <span className="material-symbols-outlined">
                            mode_comment
                        </span>
                        Commenter
                    </button>
                </div>
            </div>
            {enlargedImage && (
                <EnlargedImage src={enlargedImage} onClose={handleCloseEnlargedImage} />
            )}
        </>
    )
};

export default Post;