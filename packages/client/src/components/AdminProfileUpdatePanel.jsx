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

const AdminProfilUpdatePanel = ({ onClose, user, onUpdateSuccess }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        firstName: user?.firstName || "",
        role: user?.role || "",
        profileDescription: user?.profileDescription || "",
        profilePicture: user?.profilePicture || Profil_image,
        picturePreview: user?.profilePicture || Profil_image
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: "GET",
                credentials: "include",
            });

            if (!verifyLoginResponse.ok) {
                navigate("/login");
                return;
            }

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

            const userData = {
                email: formData.email,
                name: formData.name,
                firstName: formData.firstName,
                role: formData.role,
                profileDescription: formData.profileDescription,
                profilePicture: photoPath
            };

            const response = await authenticatedFetch(`${API_URL}/users/admin/${id}`, {
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
            
        } catch (error) {
            console.error("Erreur:", error);
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
        }
    };

    return (
        <div className="admin-profil-update-panel-container">
            <div className="admin-profil-update-panel-close-button-container">
                <span className="admin-profil-update-panel-close-button-label">Fermer</span>
                <MaterialIconButton
                    className="admin-profil-update-panel-close-button"
                    iconName="close"
                    onClick={onClose}
                />
            </div>

            <div className="admin-profil-update-panel-form-container">
                <h1 className="admin-profil-update-panel-title">Mettre à jour le profil</h1>
                <form onSubmit={handleSubmit} className="admin-profil-update-panel-form">
                    {/* Champ photo de profil */}
                    <div className="admin-profil-update-panel-form-photo">
                        <label htmlFor="profilePicture">Photo de profil</label>
                        <div className="admin-profil-update-panel-form-picture-input-container">
                            <div className="admin-profil-update-panel-picture-container">
                                <img
                                    src={formData.picturePreview || Profil_image}
                                    alt={`Image de profil de ${user?.firstName} ${user?.name}`}
                                    className="admin-profil-update-panel-picture"
                                />
                            </div>
                            <input
                                type="file"
                                className="admin-profil-update-panel-picture-input"
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
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <Input
                        label="Rôle"
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    />
                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className="admin-profil-update-panel-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="profileDescription"
                            name="profileDescription"
                            value={formData.profileDescription}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    <div className="signup-validation-button">
                        <Button label="Modifier" type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfilUpdatePanel;
