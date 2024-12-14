import React, { useState } from 'react';

import styles from "../styles/components/Input.module.scss";

const Input = ({ label, type = 'text', name, value, onChange, placeholder, onFocus }) => {
  const [inputType, setInputType] = useState(type);

  const handleToggle = () => {
    setInputType(prevType => (prevType === 'password' ? 'text' : 'password'));
  }

  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel} htmlFor={name}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.inputField}
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
        />
        {type === "password" && (
          <span className={`${styles.inputPasswordIcon} material-symbols-outlined`}
                onClick={handleToggle}>
            {inputType === 'password' ? 'visibility' : 'visibility_off'}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;