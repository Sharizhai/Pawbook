import React from "react";

import styles from "../styles/components/more-settings-button.module.scss";

const SettingsButton = ({ className, onClick }) => {
    const combinedClassName = `material-symbols-outlined ${styles.moreSettingsButton} ${className || ''}`;

    return (
        <>
            <span
                className={combinedClassName}
                onClick={onClick}
            >
                settings
            </span>
        </>
    );
};

export default SettingsButton;