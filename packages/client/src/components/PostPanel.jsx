import React, { useState, useEffect  } from 'react';
import usePostStore from '../stores/postStore';
import MaterialIconButton from './MaterialIconButton';
import Button from './Button';
import ThumbnailPicture from './ThumbnailPicture';
import '../css/PostPanel.css';
import Swal from 'sweetalert2';
import 'animate.css';
import { timeElapsed } from "../utils/timeElapsedUtils";
import AuthService from '../services/auth.service';
import authenticatedFetch from '../services/api.service';

const API_URL = import.meta.env.VITE_BASE_URL;

const PostPanel = ({ onClose, isEditing = false, post = null, isProfilePage }) => {
    const [textContent, setTextContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addPost, updatePost } = usePostStore(state => ({
        addPost: state.addPost,
        updatePost: state.updatePost
    }));

    useEffect(() => {
        if (isEditing && post) {
            setTextContent(post.textContent || '');
            if (post.images) {
                const imageObjects = post.images.map(imageUrl => ({
                    file: null, // On ne peut pas récupérer le File original
                    preview: imageUrl
                }));
                setSelectedImages(imageObjects);
            }
        }
    }, [isEditing, post]);

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
        // Vérification si le post n'est pas vide
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
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthService.getToken()}`
                },
                credentials: "include",
            });
    
            if (!verifyLoginResponse.ok) {
                throw new Error("Utilisateur non connecté");
            }
    
            const verifyLoginData = await verifyLoginResponse.json();
            const authorId = verifyLoginData.data;
    
            const postData = {
                authorId,
                textContent,
                images: selectedImages.map((image, index) => ({ [`image${index}`]: image.file }))
            };
    
            const url = isEditing 
                ? `${API_URL}/posts/${post._id}`
                : `${API_URL}/posts/create`;
    
            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                throw new Error(isEditing ? 'Erreur lors de la modification du post' : 'Erreur lors de la création du post');
            }
    
            const responseData = await response.json();
            
            if (isEditing) {
                await updatePost(responseData, isProfilePage, authorId);
            } else {
                await addPost(responseData);
            }
    
            onClose(responseData);
    
            // Notification de succès
            Swal.fire({
                icon: 'success',
                title: isEditing ? 'Post modifié' : 'Post publié',
                text: isEditing ? 'Votre post a été modifié avec succès !' : 'Votre post a été publié avec succès !',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#EEE7E2",
                color: "#001F31",
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: isEditing 
                    ? 'Une erreur est survenue lors de la modification du post.'
                    : 'Une erreur est survenue lors de la publication du post.',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#EEE7E2",
                color: "#001F31",
                timer: 5000,
                showConfirmButton: false,
                toast: true,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
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
                    <h1 className="post-panel-title-label">
                        {isEditing ? "Modifier ma publication" : "Créer une nouvelle publication"}
                    </h1>
                    <div className="post-panel-content">
                        <label htmlFor="post-text-content" className="post-panel-content-label">Contenu du post</label>
                        <textarea
                            id="post-text-content"
                            name="post-text-content"
                            value={textContent}
                            onChange={handleTextContentChange}
                            placeholder={isEditing ? "" : "Qu'allez-vous partager aujourd'hui ?"}
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
                                    key={image.preview}
                                    className="post-panel-thumbnail"
                                    src={image.preview}
                                    onDelete={() => handleDeleteImage(index)}
                                />
                            ))}
                        </div>
                    </div>
                    <Button
                        className="post-panel-publish-button"
                        label={isEditing ? "Modifier" : "Publier"}
                        onClick={handlePublish}
                    />
                </div>
            </div>
        </>
    );
};

export default PostPanel;
