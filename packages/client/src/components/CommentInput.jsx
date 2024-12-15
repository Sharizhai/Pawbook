import React, { useRef } from 'react';
import MaterialIconButton from './MaterialIconButton';

import styles from "../styles/components/CommentInput.module.scss";

const CommentInput = ({ label, name, value, onChange, placeholder, onSend }) => {
    const textareaRef = useRef(null);

    const handleInputChange = (event) => {
        onChange(event);
        adjustTextareaHeight();
      };
    
      const adjustTextareaHeight = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      };

    return (
        <div className={styles.commentInputMainContainer}>
            <label className={styles.commentInputLabel} htmlFor={name}>{label}</label>

            <div className={styles.commentInputContainer}>
                <textarea
                    ref={textareaRef}
                    className={styles.commentInputField}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    rows={1}
                />

                <MaterialIconButton
                    iconName="send"
                    className={styles.sendButton}
                    onClick={onSend}
                />
            </div>
        </div>
    );
};

export default CommentInput;