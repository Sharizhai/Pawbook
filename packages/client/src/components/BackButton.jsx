import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "../styles/components/back-button.module.scss";


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
            className={`material-symbols-outlined ${styles.backButton} ${className}`}
            onClick={handleGoBack}
        >
            west
        </span>
    );
};

export default BackButton;