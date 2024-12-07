import React from 'react';

import styles from "../styles/components/more-settings-button.module.scss";

const MoreButton = ({ className, onClick }) => {
    const combinedClassName = `material-symbols-outlined ${styles.moreSettingsButton} ${className || ''}`;

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