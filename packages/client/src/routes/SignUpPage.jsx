import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import "../css/global.css";
import "../css/SignUpPage.css";

import Profil_image from "../assets/Profil_image_2.png";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";

const SignUpPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        firstName: "",
        profileDescription: "",
        profilePicture: "",
        picturePreview: null,
        imageFile: null,
        acceptCGU: false
    });

    const [error, setError] = useState("");
    const [characterCount, setCharacterCount] = useState(0);
    const MAX_CHARS = 150;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'profileDescription') {
            setCharacterCount(value.length);
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

    const handleProfilePictureDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(prev => ({
            ...prev,
            profilePicture: "",
            picturePreview: null,
            imageFile: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword)
        {
            Swal.fire({
                icon: 'warning',
                text: "Les mots de passe doivent être identiques",
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                color: "#001F31",
                timer: 5000,
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

        if (!formData.acceptCGU) {
            Swal.fire({
                icon: 'warning',
                title: 'Conditions Générales',
                text: "Vous devez accepter les conditions générales",
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                color: "#001F31",
                timer: 3000,
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

        try {
            // Upload de la photo d'abord si elle existe
            let photoUrl = "";
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

            const userData = {
                name: formData.name,
                firstName: formData.firstName,
                email: formData.email,
                password: formData.password,
                profileDescription: formData.profileDescription,
                profilePicture: photoUrl
            };

            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/login");
                Swal.fire({
                    icon: 'success',
                    title: 'Votre compte a été créé avec succès. Bienvenue !',
                    text: "Connectez-vous pour accéder à Pawbook",
                    background: "#DEB5A5",
                    position: "top",
                    showConfirmButton: false,
                    color: "#001F31",
                    timer: 5000,
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
            } else {
                if (!response.ok) {
                    if (data.data && Array.isArray(data.data)) {
                        const errorMessages = data.data
                            .map(error => error.message)
                            .join("\n");

                        Swal.fire({
                            icon: "error",
                            title: "Votre compte n'a pas pu être créé",
                            html: errorMessages.split("\n").map(msg => `<p>${msg}</p>`).join(''),
                            background: "#DEB5A5",
                            position: "top",
                            showConfirmButton: false,
                            color: "#001F31",
                            timer: 5000,
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
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: data.message || "Erreur lors de l'inscription",
                            background: "#DEB5A5",
                            position: "top",
                            showConfirmButton: false,
                            color: "#001F31",
                            timer: 5000,
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
                    }
                    return;
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
        }
    };

    const getImageUrl = (picturePath) => {
        if (!picturePath) return Profil_image;
        if (picturePath.startsWith('http')) return picturePath;
        return `${API_URL}/uploads/${picturePath}`;
    };

    return (
        <div className="signup-page-container">
            <header className="signup-header">
                <img src={`${LOGO}`} alt="Logo du site Pawbook" className="signup-logo" />
                <h1 className="website-name signup-logo-title">Pawbook</h1>
                <p className="signup-subheading">Le premier réseau social pour les amoureux des animaux</p>
            </header>
            <main className="signup-main">
                <BackButton />
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="signup-form">
                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Entrez votre e-mail"
                        required
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                    <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Entrez à nouveau votre mot de passe"
                        required
                    />
                    <Input
                        label="Nom"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Entrez votre nom"
                        required
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Entrez votre prénom"
                        required
                    />
                    <div className="profil-update-panel-form-photo">
                        <label htmlFor="profilePicture">Photo de profil</label>
                        <div className="profil-update-panel-form-picture-input-container">
                            <div className="profil-update-panel-picture-wrapper">
                                <div className="profil-update-panel-picture-container">
                                    <img
                                        src={formData.picturePreview || getImageUrl(formData.profilePicture)}
                                        alt="Image de profil"
                                        className="signup-picture-panel-picture"
                                    />
                                    {(formData.picturePreview || formData.profilePicture) && (
                                        <button
                                            className="signup-picture-delete-button"
                                            onClick={handleProfilePictureDelete}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}
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
                    <div className="profil-update-panel-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="profileDescription"
                            name="profileDescription"
                            value={formData.profileDescription}
                            onChange={handleChange}
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
                    <div className="form-gcu-acceptation">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={formData.acceptCGU}
                                onChange={() => setFormData(prev => ({
                                    ...prev,
                                    acceptCGU: !prev.acceptCGU
                                }))}
                            />
                            J'accepte les <a href="/gcu">CGU</a>
                        </label>
                    </div>
                    <div className="signup-validation-button">
                        <Button
                            label="S'inscrire"
                            type="submit"
                            disabled={""}
                        />
                    </div>
                </form>
            </main>
            <footer className="signup-footer">
                <p>&copy; 2024 Pawbook</p>
            </footer>
        </div>
    );
};

export default SignUpPage;