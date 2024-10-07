import React, { useState } from "react";

import FloatingMenu from "./FloatingMenu";

import "../css/SettingsButton.css";

const SettingsButton = ({ className, menuType }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <span
                className={`material-symbols-outlined settings-button ${className}`}
                onClick={handleToggle}
            >
                settings
            </span>
            {isOpen && <FloatingMenu onClose={() => setIsOpen(false)} menuType={menuType} />}
        </>
    );
};

export default SettingsButton;