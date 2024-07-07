import React from 'react';
import '../css/Input.css';

const Input = ({ label, type = 'text', name, value, onChange, placeholder }) => {
  return (
    <div className="input-container">
      <label className="input-label" htmlFor={name}>{label}</label>
      <input
        className="input-field"
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;