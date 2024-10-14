import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BackButton.css';

const BackButton = ({ className, redirectTo  }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (redirectTo) {
            navigate(redirectTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <span 
            className={`material-symbols-outlined back-button ${className}`}
            onClick={handleGoBack}
        >
            west
        </span>
    );
};

export default BackButton;