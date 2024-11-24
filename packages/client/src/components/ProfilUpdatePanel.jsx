import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import Button from "./Button";
import Input from "./Input";

import '../css/ProfilUpdatePanel.css';

const ProfilUpdatePanel = ({ onClose, user, onUpdateSuccess }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    
    const getImageUrl = (picturePath) => {
        if (!picturePath) return Profil_image;
        if (picturePath.startsWith('http')) return picturePath;
        if (picturePath === Profil_image) return Profil_image;
        return `${API_URL}/uploads/${picturePath}`;
    };

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        firstName: user?.firstName || "",
        profileDescription: user?.profileDescription || "",
        profilePicture: user?.profilePicture || "",
        picturePreview: user?.profilePicture || "",
        imageFile: null
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [characterCount, setCharacterCount] = useState(0);
    const MAX_CHARS = 150;

    useEffect(() => {
        if (user?.profileDescription) {
            setCharacterCount(user.profileDescription.length);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectAll = (e) => {
        e.target.select();
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setFormData(prev => ({
                ...prev,
                profileDescription: text
            }));
            setCharacterCount(text.length);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        picturePreview: reader.result,
                        imageFile: file
                    }));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error("Erreur lors du traitement du fichier:", error);
                setError("Erreur lors du traitement du fichier");
            }
        }
    };

    const handleProfilePictureDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        try {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Confirmez-vous la suppression de la photo de profil ?',
                background: "#DEB5A5",
                position: "center",
                showConfirmButton: true,
                confirmButtonColor: "#A60815",
                confirmButtonText: 'Supprimer',
                showCancelButton: true,
                cancelButtonColor: "#45525A",
                cancelButtonText: 'Annuler',
                color: "#001F31",
                toast: true,
                customClass: {
                    background: 'swal-background'
                },
                showClass: {
                    popup: `animate__animated animate__fadeInDown animate__faster`
                },
                hideClass: {
                    popup: `animate__animated animate__fadeOutUp animate__faster`
                }
            });
    
            if (result.isConfirmed) {
                const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    credentials: "include"
                });
    
                if (!verifyLoginResponse.ok) {
                    throw new Error("Utilisateur non connecté");
                }
    
                // Extraire l'ID de la photo depuis l'URL
                const urlParts = formData.profilePicture.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const photoId = fileName.split('.')[0];
    
                const deleteResponse = await authenticatedFetch(`${API_URL}/photos/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        photoId,
                    }),
                    credentials: "include"
                });
    
                if (!deleteResponse.ok) {
                    throw new Error("Erreur lors de la suppression de la photo");
                }
    
                setFormData(prev => ({
                    ...prev,
                    profilePicture: "",
                    picturePreview: null
                }));
    
                Swal.fire({
                    icon: 'success',
                    title: 'Photo supprimée',
                    text: 'La photo de profil a été supprimée avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
                    toast: true
                });
            }
        } catch (error) {
            console.error("Erreur de suppression de photo:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message,
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                color: "#001F31",
                timer: 5000,
                toast: true
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                navigate("/login");
                return;
            }

            const { data: userId } = await verifyLoginResponse.json();

            // Upload de la photo d'abord si elle existe
            let photoUrl = formData.profilePicture;
            console.log(photoUrl + "pour Upload de la photo d'abord si elle existe");

            if (formData.imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', formData.imageFile);
    
                const photoResponse = await fetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    body: uploadData,
                });
    
                if (!photoResponse.ok) {
                    throw new Error("Erreur lors de l'upload de la photo");
                }
    
                const { data: photoData } = await photoResponse.json();
                photoUrl = photoData.photoUrl;
            }
    
            // Créer l'objet de données à envoyer au serveur
            const updatedFormData = {
                email: formData.email,
                name: formData.name,
                firstName: formData.firstName,
                profileDescription: formData.profileDescription,
                profilePicture: photoUrl
            };
    
            console.log('Données envoyées au serveur:', updatedFormData);

            if (userId === user?._id) {
                const response = await authenticatedFetch(`${API_URL}/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedFormData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erreur lors de la mise à jour');
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Profil mis à jour avec succès',
                    background: "#DEB5A5",
                    position: "top",
                    timer: 3000,
                    showConfirmButton: false,
                    toast: true
                });

                onUpdateSuccess();
            }
        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message,
                background: "#DEB5A5",
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                toast: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="profil-update-panel-container">
            <div className="profil-update-panel-close-button-container">
                <span className="profil-update-panel-close-button-label">Fermer</span>
                <MaterialIconButton
                    className="profil-update-panel-close-button"
                    iconName="close"
                    onClick={onClose}
                />
            </div>

            <div className="profil-update-panel-form-container">
                <h1 className="profil-update-panel-title">Mettre à jour le profil</h1>
                <form onSubmit={handleSubmit} className="profil-update-panel-form">
                    <div className="profil-update-panel-form-photo">
                        <label htmlFor="profilePicture">Photo de profil</label>
                        <div className="profil-update-panel-form-picture-input-container">

                        <div className="profil-update-panel-picture-wrapper">
                            <div className="profil-update-panel-picture-container">
                                <img src={formData.picturePreview || getImageUrl(formData.profilePicture)} alt={`Image de profil de ${user?.firstName} ${user?.name}`} className="profil-update-panel-picture" />
                                <button className="profil-update-panel-delete-button" onClick={handleProfilePictureDelete
                                    }>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                            </div>
                            </div>
                            <input
                                type="file"
                                className="profil-update-panel-picture-input"
                                id="profilePicture"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                    </div>
                    <Input
                        label="Nom"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                        placeholder="Entrez votre nom"
                        required
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                        placeholder="Entrez votre prénom"
                        required
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={handleSelectAll}
                        placeholder="Entrez votre e-mail"
                        required
                    />
                    <div className="profil-update-panel-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="profileDescription"
                            className="profil-update-panel-input-field"
                            name="profileDescription"
                            value={formData.profileDescription}
                            onChange={handleDescriptionChange}
                            onFocus={handleSelectAll}
                            placeholder="Décrivez-vous en quelques mots"
                            rows="4"
                            maxLength={MAX_CHARS}
                        ></textarea>
                        <div className={`character-count ${characterCount >= MAX_CHARS ? 'at-limit' :
                                characterCount >= MAX_CHARS * 0.9 ? 'near-limit' : ''
                            }`}>
                            {characterCount}/{MAX_CHARS} caractères
                        </div>
                    </div>
                    <div className="signup-validation-button">
                        <Button
                            className="update-validation-button"
                            label="Modifier"
                            type="submit"
                        />
                    </div>
                </form>

            </div>
        </div>
    )
};

export default ProfilUpdatePanel;