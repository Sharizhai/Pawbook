import React, { useState, useRef } from 'react';
import '../css/MaterialIconButton.css';

const MaterialIconButton = ({ 
    className, 
    iconName, 
    onClick, 
    onOpenMenu, 
    onClosePanel,
    onPhotoSelect 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (iconName === "settings" || iconName === "more_vert") {
            setIsOpen(!isOpen);
            if (onOpenMenu) onOpenMenu();
        } else if (iconName === "close") {
            if (onClosePanel) onClosePanel();
        }
        
        if (onClick) onClick();
    };

    return (
        <>
            {iconName === "photo_library" ? (
                <button className={`material-icon-button-container ${className || ""}`} onClick={handleClick}>
                    <span className="material-symbols-outlined more-button">
                        {iconName}
                    </span>
                    <span className="add-photos-text">Ajouter des photos</span>
                </button>
            ) : (
                <span
                    className={`material-symbols-outlined more-button ${className}`}
                    onClick={handleClick}
                >
                    {iconName}
                </span>
            )}
        </>
    );
};

export default MaterialIconButton;