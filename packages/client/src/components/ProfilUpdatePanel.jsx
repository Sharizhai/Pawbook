import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import Profil_image from "../assets/Profil_image_2.png";
import MaterialIconButton from "./MaterialIconButton";
import Button from "./Button";
import Input from "./Input";

import '../css/ProfilUpdatePanel.css';

const ProfilUpdatePanel = ({ onClose, user }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [profileDescription, setProfileDescription] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleProfileDescriptionChange = (e) => setProfileDescription(e.target.value);
    const handleProfilePictureChange = (e) => setProfilePicture(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

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
                            <img src={user?.profilePicture || Profil_image} alt={`Image de profil de ${user?.firstName} ${user?.name}`} className="profil-update-panel-picture" />
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
                        value={user?.name}
                        onChange={handleNameChange}
                        placeholder="Entrez votre nom"
                        required
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={user?.firstName}
                        onChange={handleFirstNameChange}
                        placeholder="Entrez votre prénom"
                        required
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={user?.email}
                        onChange={handleEmailChange}
                        placeholder="Entrez votre e-mail"
                        required
                    />
                    <div className="profil-update-panel-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="profileDescription"
                            className="profil-update-panel-input-field"
                            name="profileDescription"
                            value={user?.profileDescription}
                            onChange={handleProfileDescriptionChange}
                            placeholder="Décrivez-vous en quelques mots"
                            rows="4"
                        ></textarea>
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