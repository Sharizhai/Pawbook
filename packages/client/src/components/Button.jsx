import React from 'react';
import PropTypes from 'prop-types';
import styles from "../styles/components/Button.module.scss";

const Button = ({onClick, 
                 label, 
                 type = "button", 
                 className, 
                 style, 
                 disabled = false,
                 ...props
}) => {
    const combinedClassName = `${styles.buttonDefault} ${className || ''}`;

    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedClassName}
            disabled={disabled}
            style={style}
            {...props}
        >
            {label}
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    className: PropTypes.string,
    style: PropTypes.object
};

export default Button;