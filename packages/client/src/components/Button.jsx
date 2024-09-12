import React from 'react';
import PropTypes from 'prop-types';
import '../css/Button.css';

const Button = ({onClick, 
                 label, 
                 type = "button", 
                 className, 
                 style, 
                 ...props
}) => {
    const combinedClassName = `button-default ${className || ''}`;

    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedClassName}
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