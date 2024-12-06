import React from 'react';

import MaterialIconButton from "./MaterialIconButton";
import styles from '../styles/components/close-button.module.scss';

const ClosePanelButton = ({ onClick, onClosePanel }) => {

    const handleClick = () => {
        if (onClosePanel) onClosePanel();
    };
    return (
        <div className={styles.closeButtonContainer}>
            <span className={styles.closeButtonLabel}>Fermer</span>
            <MaterialIconButton
                className={styles.closeButtonIcon}
                iconName="close"
                onClick={onClick}
            />
        </div>
    );
};

export default ClosePanelButton;