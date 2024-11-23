import React, { useState, useEffect  } from 'react';
import usePostStore from '../stores/postStore';
import MaterialIconButton from './MaterialIconButton';
import Button from './Button';
import ThumbnailPicture from './ThumbnailPicture';
import '../css/PostPanel.css';
import Swal from 'sweetalert2';
import 'animate.css';
import AuthService from '../services/auth.service';
import authenticatedFetch from '../services/api.service';

const API_URL = import.meta.env.VITE_BASE_URL;

const PostPanel = ({ onClose, isEditing = false, post = null, isProfilePage, profileUserId }) => {
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
            if (post.photoContent) {
                const imageObjects = post.photoContent.map(imageUrl => ({
                    file: null,
                    preview: imageUrl,
                    isExisting: true,
                    url: imageUrl
                }));
                setSelectedImages(imageObjects);
            }
        }
    }, [isEditing, post]);

    const handleTextContentChange = (e) => setTextContent(e.target.value);

    const handlePhotoSelect = (files) => {
        if (files && files.length > 0) {
            if (selectedImages.length + files.length > 5) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Vous ne pouvez pas ajouter plus de 5 photos.',
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
                return;
            }

            const newImages = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
                isExisting: false
            }));
            setSelectedImages(prevImages => [...prevImages, ...newImages]);
        }
    };

    const handleDeleteImage = async (index) => {
        const imageToDelete = selectedImages[index];

        // Si c'est une image qui vient d'être uploadée (pas encore sur le serveur)
        if (!imageToDelete.isExisting) {
            setSelectedImages(prevImages => {
                const updatedImages = prevImages.filter((_, i) => i !== index);
                URL.revokeObjectURL(imageToDelete.preview);
                return updatedImages;
            });
            return;
        }

        // Si c'est une image existante
        try {
            const urlParts = imageToDelete.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const photoId = fileName.split('.')[0];

            const response = await authenticatedFetch(`${API_URL}/photos/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ photoId }),
            });

            if (response.ok) {
                setSelectedImages(prevImages => 
                    prevImages.filter((_, i) => i !== index)
                );

                Swal.fire({
                    icon: 'success',
                    text: 'Image supprimée avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                });
            } else {
                throw new Error('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'image:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erreur lors de la suppression de l\'image',
                background: "#DEB5A5",
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                toast: true,
            });
        }
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
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                }
            });
            return;
        }
    
        setIsLoading(true);
    
        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                credentials: "include",
            });
    
            if (!verifyLoginResponse.ok) {
                throw new Error("Utilisateur non connecté");
            }
    
            const verifyLoginData = await verifyLoginResponse.json();
            const authorId = verifyLoginData.data;
    
            let finalImageUrls = [];
    
            if (selectedImages.length > 0) {
                const newImages = selectedImages.filter(image => image.file);
                const existingImageUrls = selectedImages
                    .filter(img => !img.file)
                    .map(img => img.preview);
    
                if (newImages.length > 0) {
                    let uploadedUrls = [];
    
                    if (newImages.length === 1) {
                        const formData = new FormData();
                        formData.append("file", newImages[0].file);
    
                        const uploadResponse = await fetch(`${API_URL}/photos/upload`, {
                            method: "POST",
                            body: formData
                        });
    
                        if (!uploadResponse.ok) {
                            throw new Error("Erreur lors de l'upload de l'image");
                        }
    
                        const uploadData = await uploadResponse.json();
                        uploadedUrls = uploadData.data?.photoUrl ? [uploadData.data.photoUrl] : [];
                    } else {
                        const formData = new FormData();
                        newImages.forEach(image => {
                            formData.append("files", image.file);
                        });
    
                        const uploadResponse = await fetch(`${API_URL}/photos/multipleUpload`, {
                            method: "POST",
                            body: formData
                        });
    
                        if (!uploadResponse.ok) {
                            throw new Error("Erreur lors de l'upload des images");
                        }
    
                        const uploadData = await uploadResponse.json();
                        uploadedUrls = uploadData.data?.map(photo => photo.photoUrl).filter(Boolean) || [];
                    }
    
                    finalImageUrls = [...existingImageUrls, ...uploadedUrls];
                } else {
                    finalImageUrls = existingImageUrls;
                }
            }
    
            const postData = {
                authorId,
                textContent: textContent.trim(),
                photoContent: finalImageUrls
            };
    
            console.log('PostData being sent:', postData);
    
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
                const errorData = await response.json();
                throw new Error(errorData.message || (isEditing ? 'Erreur lors de la modification du post' : 'Erreur lors de la création du post'));
            }
    
            const responseData = await response.json();
    
            if (isEditing) {
                updatePost(responseData.data, isProfilePage, authorId, profileUserId);
            } else {
                addPost(responseData.data, isProfilePage, authorId, profileUserId);
            }
    
            selectedImages.forEach(image => {
                if (image.preview && image.file) {
                    URL.revokeObjectURL(image.preview);
                }
            });
    
            Swal.fire({
                icon: 'success',
                title: isEditing ? 'Publication modifiée' : 'Publication créée',
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
    
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                text: error.message,
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
