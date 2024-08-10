import React, {useState} from 'react';
import '../css/MaterialIconButton.css';

const MaterialIconButton = ({ className, iconName, onClick, onOpenMenu,             onClosePanel }) => {

    const [isOpen, setIsOpen] = useState(false);

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
        <span 
            className={`material-symbols-outlined more-button ${className}`}
            onClick={handleClick}
        >
            {iconName}
        </span>
    );
};

export default MaterialIconButton;