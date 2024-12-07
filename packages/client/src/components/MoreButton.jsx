import React, {useState} from 'react';
import styles from "../styles/components/more-button.module.scss";

const MoreButton = ({ className, onClick }) => {
    const combinedClassName = `material-symbols-outlined ${styles.moreButton} ${className || ''}`;

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