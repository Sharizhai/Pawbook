import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import AuthService from '../services/auth.service';
import Button from "./Button";
import Input from "./Input";

import '../css/ProfilUpdatePanel.css';

const ProfilUpdatePanel = ({ onClose, user, onUpdateSuccess }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        firstName: user?.firstName || "",
        profileDescription: user?.profileDescription || "",
        profilePicture: user?.profilePicture || Profil_image,
        picturePreview: user?.profilePicture || Profil_image
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [characterCount, setCharacterCount] = useState(0);
    const MAX_CHARS = 150;

    const getImageUrl = (picturePath) => {
        if (!picturePath) return Profil_image;
        if (picturePath.startsWith('http')) return picturePath;
        if (picturePath === Profil_image) return Profil_image;
        return `${API_URL}/uploads/${picturePath}`;
    };

    useEffect(() => {
        if (user?.profileDescription) {
            setCharacterCount(user.profileDescription.length);
        }
        if (user?.profilePicture) {
            setFormData(prev => ({
                ...prev,
                profilePicture: user.profilePicture,
                picturePreview: getImageUrl(user.profilePicture)
            }));
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

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadData = new FormData();
                uploadData.append('file', file);

                const response = await authenticatedFetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    body: uploadData
                });

                const { data } = await response.json();
                setFormData(prev => ({
                    ...prev,
                    profilePicture: data.photoUrl
                }));
            } catch (error) {
                console.error("Erreur lors du traitement du fichier:", error);
                setError("Erreur lors du traitement du fichier");
            }
        }
    };

    const handlePictureDelete = async () => {
        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${AuthService.getToken()}`
                },
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                throw new Error("Utilisateur non connecté");
            }

            const deleteResponse = await authenticatedFetch(`${API_URL}/photos/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({ 
                    photoName: formData.profilePicture,
                    userId: user?._id 
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

    const handlePictureClick = (imageSrc) => {
        setEnlargedImage(imageSrc);
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
                    "Authorization": `Bearer ${AuthService.getToken()}`
                },
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                navigate("/login");
                return;
            }

            const { data: userId } = await verifyLoginResponse.json();

            // Upload de la photo d'abord si elle existe
            let photoPath = formData.profilePicture;
            if (formData.profilePicture instanceof File) {
                const uploadData = new FormData();
                uploadData.append('file', formData.profilePicture);

                const photoResponse = await authenticatedFetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    body: uploadData,
                });

                if (!photoResponse.ok) {
                    throw new Error("Erreur lors de l'upload de la photo");
                }

                const photoResult = await photoResponse.json();
                photoPath = photoResult.data.photoName;
            }

            if (userId === user?._id) {
                const userData = {
                    email: formData.email,
                    name: formData.name,
                    firstName: formData.firstName,
                    profileDescription: formData.profileDescription,
                    profilePicture: photoPath
                };

                const response = await authenticatedFetch(`${API_URL}/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
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
                onClose();
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

    const EnlargedImage = ({ src, onClose }) => (
        <div className="enlarged-image-overlay" onClick={onClose}>
            <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                Fermer
                <span className="material-symbols-outlined">close</span>
            </button>
            <img src={src} alt="Image agrandie" onClick={(e) => e.stopPropagation()} />
        </div>
    );


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

                            <div className="profil-update-panel-picture-container">
                                <img src={formData.picturePreview || getImageUrl(formData.profilePicture)} alt={`Image de profil de ${user?.firstName} ${user?.name}`} className="profil-update-panel-picture" 
                                onClick={() => handlePictureClick(formData.picturePreview || getImageUrl(formData.profilePicture))}/>
                            </div>
                            <input
                                type="file"
                                className="profil-update-panel-picture-input"
                                id="profilePicture"
                                accept="image/*"
                                onChange={handlePictureChange}
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