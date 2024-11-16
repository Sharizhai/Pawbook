import React, { useRef } from 'react';
import MaterialIconButton from './MaterialIconButton';
import '../css/CommentInput.css';

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
        <div className="comment-input-main-container">
            <label className="comment-input-label" htmlFor={name}>{label}</label>

            <div className="comment-input-container">
                <textarea
                    ref={textareaRef}
                    className="comment-input-field"
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    rows={1}
                />

                <MaterialIconButton
                    iconName="send"
                    className="send-button"
                    onClick={onSend}
                />
            </div>
        </div>
    );
};

export default CommentInput;