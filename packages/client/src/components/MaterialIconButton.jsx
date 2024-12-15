import React, { useState, useRef } from 'react';

import styles from "../styles/components/MaterialIconButton.module.scss";
//import '../css/MaterialIconButton.css';

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
                <button className={`${styles.materialIconButtonContainer} ${className || ""}`} onClick={handleClick}>
                    <span className={`material-symbols-outlined ${styles.moreButton}`}>
                        {iconName}
                    </span>
                    <span className={styles.addPhotosText}>Ajouter des photos</span>
                </button>
            ) : (
                <span
                    className={`material-symbols-outlined ${styles.moreButton} ${className}`}
                    onClick={handleClick}
                >
                    {iconName}
                </span>
            )}
        </>
    );
};

export default MaterialIconButton;