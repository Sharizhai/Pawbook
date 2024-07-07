import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <span 
            className="material-symbols-outlined back-button"
            onClick={handleGoBack}
        >
            west
        </span>
    );
};

export default BackButton;