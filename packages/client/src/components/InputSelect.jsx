import React from "react";
import "../css/InputSelect.css";

const InputSelect = ({ label, name, value, onChange, options, placeholder }) => {
  return (
    <div className="input-select-container">
      <label className="input-select-label" htmlFor={name}>{label}</label>
      <select
        className="input-select-field"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;