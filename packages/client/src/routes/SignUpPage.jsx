import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import "../css/global.css";
import "../css/SignUpPage.css";

import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";

const SignUpPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [profileDescription, setProfileDescription] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [acceptCGU, setAcceptCGU] = useState(false);
    const [error, setError] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleProfileDescriptionChange = (e) => setProfileDescription(e.target.value);
    const handleProfilePictureChange = (e) => setProfilePicture(e.target.files[0]);
    const handleAcceptCGUChange = () => setAcceptCGU(!acceptCGU);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            alert("Les mots de passe doivent être identiques");
            return;
        }

        const userData = {
            name,
            firstName,
            email,
            password,
            profileDescription
        };

        console.log("Données envoyées:", userData);

        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            console.log("Statut de la réponse:", response.status);

            const data = await response.json();
            console.log("Données reçues:", data);

            if (response.ok) {
                navigate("/login");
            } else {
                if (data.data && Array.isArray(data.data)) {
                    const errorMessages = data.data.map(err => `${err.path.join(".")} : ${err.message}`).join(", ");
                    setError(`Erreurs de validation: ${errorMessages}`);
                } else {
                    setError(data.message || "Erreur lors de l'inscription");
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div className="signup-page-container">
            <header className="signup-header">
                <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="signup-logo" />
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
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Entrez votre e-mail"
                        required
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                    <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Entrez à nouveau votre mot de passe"
                        required
                    />
                    <Input
                        label="Nom"
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Entrez votre nom"
                        required
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        placeholder="Entrez votre prénom"
                        required
                    />
                    <div className="form-photo">
                        <label htmlFor="profilePicture">Photo de profil</label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                        />
                    </div>
                    <div className="form-description">
                        <label htmlFor="profileDescription">Description</label>
                        <textarea
                            id="profileDescription"
                            name="profileDescription"
                            value={profileDescription}
                            onChange={handleProfileDescriptionChange}
                            placeholder="Décrivez-vous en quelques mots"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="form-gcu-acceptation">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={acceptCGU}
                                onChange={handleAcceptCGUChange}
                            />
                            J'accepte les <a href="/gcu">CGU</a>
                        </label>
                    </div>
                    <div className="signup-validation-button">
                        <Button
                            label="S'inscrire"
                            type="submit"
                            disabled={!acceptCGU || !email || !password || !confirmPassword || !name || !firstName}
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