import React, { useState } from 'react';
import '../css/Input.css';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, onFocus }) => {
  const [inputType, setInputType] = useState(type);

  const handleToggle = () => {
    setInputType(prevType => (prevType === 'password' ? 'text' : 'password'));
  }

  return (
    <div className="input-container">
      <label className="input-label" htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          className="input-field"
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
        />
        {type === "password" && (
          <span className="input-password-icon material-symbols-outlined"
                onClick={handleToggle}>
            {inputType === 'password' ? 'visibility' : 'visibility_off'}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;