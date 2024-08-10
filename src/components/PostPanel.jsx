import React, { useState } from 'react';

import MaterialIconButton from './MaterialIconButton';
import Button from './Button';

import '../css/PostPanel.css';

const PostPanel = ({ onClose }) => {
    const [textContent, setTextContent] = useState('');
    const handleTextContentChange = (e) => setTextContent(e.target.value);

    const handlePhotoSelect = (files) => {
        //TODO : 
        //Gérer les photos uploadées
        console.log('Photos sélectionnées:', files);
    };

    return (
        <>
            <div className="post-panel-main-container">
                <div className="post-panel-close-button-container">
                <span className="post-panel-close-button-label">Fermer</span>
                <MaterialIconButton className={"post-panel-close-button"}
                    iconName={"close"}
                    onClick={onClose} />

                </div>
                <div className="post-panel-container">

                    <h1 className="post-panel-title-label">Créer une nouvelle publication</h1>


                    <div className="post-panel-content">
                        <label htmlFor="post-text-content" className="post-panel-content-label">Contenu du post</label>
                        <textarea
                            id="post-text-content"
                            name="post-text-content"
                            value={textContent}
                            onChange={handleTextContentChange}
                            placeholder="Qu'allez-vous partager aujourd'hui ?"
                            rows="4"
                        ></textarea>
                        <MaterialIconButton className={"post-panel-photo-upload-button"}
                            iconName={"photo_library"}
                            onPhotoSelect={handlePhotoSelect} />
                    </div>
                    <Button className="post-panel-publish-button" 
                            label="Publier"/>
                </div>
            </div>
        </>
    );
};

export default PostPanel;