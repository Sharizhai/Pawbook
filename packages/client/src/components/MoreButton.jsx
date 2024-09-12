import React, {useState} from 'react';
import '../css/MoreButton.css';

const MoreButton = ({ className }) => {

    const [isOpen, setIsOpen] = useState(false);
    // TODO : ajouter de quoi ouvrir un menu flottant

    return (
        <span 
        className={`material-symbols-outlined more-button ${className}`}
        >
            more_vert
        </span>
    );
};

export default MoreButton;