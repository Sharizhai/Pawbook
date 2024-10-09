import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import '../css/global.css';
import '../css/SignUpPage.css';

import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [acceptCGU, setAcceptCGU] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleProfilePictureChange = (e) => setProfilePicture(e.target.files[0]);
    const handleAcceptCGUChange = () => setAcceptCGU(!acceptCGU);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Les mots de passe doivent être identiques");
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("lastName", lastName);
        formData.append("firstName", firstName);
        if (description) {
            formData.append("description", description);
        }
        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Inscription réussie, redirection
                navigate("/login");
            } else {
                alert(data.msg || "Erreur lors de l'inscription");
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
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
                <form onSubmit={handleSubmit} className="signup-form">
                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Entrez votre e-mail"
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Entrez votre mot de passe"
                    />
                    <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Entrez à nouveau votre mot de passe"
                    />
                    <Input
                        label="Nom"
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={handleLastNameChange}
                        placeholder="Entrez votre nom"
                    />
                    <Input
                        label="Prénom"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        placeholder="Entrez votre prénom"
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
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleDescriptionChange}
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
                            onClick={handleSubmit} // Associe le handleSubmit à l'événement onClick
                            disabled={!acceptCGU || !email || !password || !confirmPassword || !lastName || !firstName} // Désactive si les CGU ne sont pas acceptées ou si certains champs obligatoires sont vides
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