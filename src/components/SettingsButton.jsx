import React, {useState} from 'react';
import '../css/BackButton.css';

const SettingsButton = ({ className }) => {

    const [isOpen, setIsOpen] = useState(false);
    // TODO : ajouter de quoi ouvrir un menu flottant

    return (
        <span 
        className={`material-symbols-outlined settings-button ${className}`}
        >
            settings
        </span>
    );
};

export default SettingsButton;