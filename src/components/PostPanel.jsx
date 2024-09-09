import React, { useState } from 'react';
import usePostStore from '../stores/postStore';
import { timeElapsed } from "../utils/timeElapsedUtils";

import MaterialIconButton from './MaterialIconButton';
import Button from './Button';

import '../css/PostPanel.css';

const PostPanel = ({ onClose }) => {
    const [textContent, setTextContent] = useState('');
    const handleTextContentChange = (e) => setTextContent(e.target.value);
    const addPost = usePostStore(state => state.addPost);

    const handlePhotoSelect = (files) => {
        //TODO : 
        //Gérer les photos uploadées
        console.log('Photos sélectionnées:', files);
    };

    const handlePublish = () => {
        const newPost = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            user: {
                firstName: 'Jane',
                lastName: 'Doe'
              },
              content: textContent,
              images: selectedImages.map(img => img.preview)
            };
            addPost(newPost);
            onClose();
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
                            label="Publier"
                            onClick={handlePublish}/>
                </div>
            </div>
        </>
    );
};

export default PostPanel;