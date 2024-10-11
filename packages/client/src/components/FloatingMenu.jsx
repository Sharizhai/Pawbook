import React from "react";

import MaterialIconButton from './MaterialIconButton';

import '../css/FloatingMenu.css';

const FloatingMenu = ({ onClose }) => {
    return (
        <>
            <div className="floating-menu-main-panel">
                <div className="floating-menu-panel">

                <div className="floating-menu-close-button-container">
                <MaterialIconButton
                        className="floating-menu-close-button"
                        iconName="close"
                        onClick={onClose}
                    />
                </div>

                </div>
            </div>
        </>
    )
};

export default FloatingMenu;