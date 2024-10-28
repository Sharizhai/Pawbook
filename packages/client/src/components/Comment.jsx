import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import FloatingMenu from "./FloatingMenu";
import MaterialIconButton from "./MaterialIconButton";
import Profil_image from "../assets/Profil_image_2.png";
import floatingMenusData from "../data/floatingMenusData.json"
import MoreButton from "./MoreButton";
import Button from './Button';

import "../css/Comment.css";

const Comment = ({ author, textContent, currentUserId }) => {
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const menuItems = currentUserId === author?._id
        ? floatingMenusData.comment.user
        : floatingMenusData.comment.other;

    const handleFloatingMenuOpen = () => {
        setIsFloatingMenuOpen(true);
    };

    const handleFloatingMenuClose = () => {
        setIsFloatingMenuOpen(false);
    };

    const handleSettingsButtonClick = async (action) => {
        switch (action) {
            case "editComment":
                break;

            case "deleteComment":
                // TODO :
                // Ajouter logique pour signaler un user
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

            default:
                console.log("Action not implemented:", action);
        }
        setIsFloatingMenuOpen(false);
    };

    return (
        <>
            <div className="comment-container">

                <div className="comment-profil-picture-container">
                    <img src={author?.profileImage || Profil_image} alt={`Image de profil de ${author?.firstName} ${author?.name}`} className="comment-profil-picture" />
                </div>

                <div className="comment-name-and-comment">
                    <div className="comment-name-firstname">
                        {author?.firstName} {author?.name}
                    </div>

                    <div className="comment-display">
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

                <MoreButton className="comment-more-button"
                    onClick={handleFloatingMenuOpen} />
            </div>
        </>
    )
}

export default Comment;