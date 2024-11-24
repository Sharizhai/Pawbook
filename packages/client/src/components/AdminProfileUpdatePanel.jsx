import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import Button from "./Button";
import Input from "./Input";

import '../css/AdminProfilUpdatePanel.css';

const AdminProfilUpdatePanel = ({ onClose, user, onUpdateSuccess }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        firstName: user?.firstName || "",
        role: user?.role || "",
        profileDescription: user?.profileDescription || "",
        profilePicture: user?.profilePicture || Profil_image,
        picturePreview: user?.profilePicture || Profil_image,
        imageFile: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    picturePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.email || !formData.name || !formData.firstName || !formData.role) {
            setError("Veuillez remplir tous les champs obligatoires");
            return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("L'adresse email n'est pas valide");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setError("");
            if (!validateForm()) {
                return;
            }

            const verifyAdminResponse = await authenticatedFetch(`${API_URL}/users/verifyAdmin`, {
                method: "GET",
                credentials: "include",
            });

            if (!verifyAdminResponse.ok) {
                setIsSubmitting(false);
                navigate("/login");
                return;
            }

            let photoPath = user?.profilePicture;

            if (formData.imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', formData.imageFile);

                const photoResponse = await fetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    credentials: 'include',
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

            const response = await authenticatedFetch(`${API_URL}/users/admin/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour');
            }

            onUpdateSuccess();
            onClose();
        } catch (error) {
            setError(error.message);
            console.error("Erreur:", error);
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
