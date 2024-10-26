import React, {useState} from 'react';
import '../css/MoreButton.css';

const MoreButton = ({ className, onClick }) => {
    const combinedClassName = `material-symbols-outlined settings-button ${className || ''}`;

    return (
        <span 
        className={combinedClassName}
        onClick={onClick}
        >
            more_vert
        </span>
    );
};

export default MoreButton;