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
        } else if (iconName === "photo_library") {
            fileInputRef.current.click();
        }
        if (onClick) onClick();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0 && onPhotoSelect) {
            onPhotoSelect(files);
        }
    };

    return (
        <>
            {iconName === "photo_library" ? (
                <button className={`material-icon-button-container ${className || ""}`} onClick={handleClick}>
                    <span className="material-symbols-outlined more-button">
                        {iconName}
                    </span>
                    <span className="add-photos-text">Ajouter des photos</span>
                    <input 
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                    />
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