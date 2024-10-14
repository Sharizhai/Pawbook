import React, { useState } from 'react';
import usePostStore from '../stores/postStore';
import MaterialIconButton from './MaterialIconButton';
import Button from './Button';
import ThumbnailPicture from './ThumbnailPicture';
import '../css/PostPanel.css';
import Swal from 'sweetalert2';
import 'animate.css';
import { timeElapsed } from "../utils/timeElapsedUtils";

const API_URL = import.meta.env.VITE_BASE_URL;

const PostPanel = ({ onClose }) => {
    const [textContent, setTextContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const addPost = usePostStore(state => state.addPost);

    const handleTextContentChange = (e) => setTextContent(e.target.value);

    const handlePhotoSelect = (files) => {
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setSelectedImages(prevImages => [...prevImages, ...newImages]);
        }
    };

    const handleDeleteImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (!textContent.trim() && selectedImages.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Publication impossible',
                text: 'Votre publication ne peut pas être vide.',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#EEE7E2",
                color: "#001F31",
                timer: 5000,
                showConfirmButton: false,
                toast: true,
                showClass: {
                    popup: `animate__animated
                            animate__fadeInDown
                            animate__faster`
                },
                hideClass: {
                    popup: `animate__animated
                            animate__fadeOutUp
                            animate__faster`
                }
            });
            return;
        }

        setIsLoading(true);

        try {
            const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                console.error("Utilisateur non connecté");
                return;
            }

            const verifyLoginData = await verifyLoginResponse.json();
            console.log(verifyLoginData);
            const authorId = verifyLoginData.data;
            console.log("authorId : ", authorId._id);

            const formData = new FormData();
            formData.append('authorId', authorId); 
            formData.append('textContent', textContent);
            // selectedImages.forEach((image, index) => {
            //     formData.append(`image${index}`, image.file);
            // });

            console.log("FormData envoyé:", Object.fromEntries(formData));

            const response = await fetch(`${API_URL}/posts/create`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du post');
            }

            const newPost = await response.json();
                
            addPost(newPost);
            onClose();
            Swal.fire({
                icon: 'success',
                title: 'Post publié',
                text: 'Votre post a été publié avec succès !',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#EEE7E2",
                color: "#001F31",
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                showClass: {
                    popup: `animate__animated
                            animate__fadeInDown
                            animate__faster`
                },
                hideClass: {
                    popup: `animate__animated
                            animate__fadeOutUp
                            animate__faster`
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la publication du post.',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#EEE7E2",
                color: "#001F31",
                timer: 5000,
                showConfirmButton: false,
                toast: true,
                showClass: {
                    popup: `animate__animated
                            animate__fadeInDown
                            animate__faster`
                },
                hideClass: {
                    popup: `animate__animated
                            animate__fadeOutUp
                            animate__faster`
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="post-panel-main-container">
                <div className="post-panel-close-button-container">
                    <span className="post-panel-close-button-label">Fermer</span>
                    <MaterialIconButton
                        className="post-panel-close-button"
                        iconName="close"
                        onClick={onClose}
                    />
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
                        <MaterialIconButton
                            className="post-panel-photo-upload-button"
                            iconName="photo_library"
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => handlePhotoSelect(e.target.files)}
                        />
                        <div className="post-panel-thumbnails-grid">
                            {selectedImages.map((image, index) => (
                                <ThumbnailPicture
                                    key={index}
                                    className="post-panel-thumbnail"
                                    src={image.preview}
                                    onDelete={() => handleDeleteImage(index)}
                                />
                            ))}
                        </div>
                    </div>
                    <Button
                        className="post-panel-publish-button"
                        label="Publier"
                        onClick={handlePublish}
                    />
                </div>
            </div>
        </>
    );
};

export default PostPanel;
