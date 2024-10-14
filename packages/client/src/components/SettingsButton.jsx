import React, { useState } from "react";

import "../css/SettingsButton.css";

const SettingsButton = ({ className, onClick }) => {
    const combinedClassName = `material-symbols-outlined settings-button ${className || ''}`;

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