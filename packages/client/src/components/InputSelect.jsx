import React from "react";

import styles from "../styles/components/InputSelect.module.scss";

const InputSelect = ({ label, name, value, onChange, options, placeholder }) => {
  return (
    <div className={styles.inputSelectContainer}>
      <label className={styles.inputSelectLabel} htmlFor={name}>{label}</label>
      <select
        className={styles.inputSelectField}
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