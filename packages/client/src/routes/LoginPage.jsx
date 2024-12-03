import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import "../css/global.css";
import "../css/LoginPage.css";

import authenticatedFetch from "../services/api.service";
import AuthService from "../services/auth.service";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";

const LoginPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const userData = { email, password };

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Erreur lors de la connexion");
                return;
            }
            
            if (data.data && data.data.token) {
                AuthService.setToken(data.data.token);
            }
            
            navigate("/newsfeed");
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
        }
    };

    return (
        <>
            <div className="login-page-container">
                <main className="login-main-container">
                    <header className="login-header-container">
                        <img src={`${LOGO}`} alt="Logo du site Pawbook" className="home-logo" />
                        <h1 className="website-name login-logo-title">Pawbook</h1>
                        <p className="login-subheading">Le premier réseau social pour les amoureux des animaux</p>
                    </header>

                    <div className="form-aside-container">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <BackButton redirectTo="/"/>

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
                            <a href="/forgotten-password" className="login-form-forgotten-pwd">Mot de passe oublié ?</a>

                            <Button
                                className="login-connexion-btn"
                                label="Connexion"
                                type="submit"
                            />
                            {error && <p className="error-message">{error}</p>}
                        </form>

                        <aside className="login-no-account-container">
                            <p className="login-no-account-text">Pas de compte ?</p>
                            <Button
                                label="Créer un compte"
                                onClick={() => navigate("/signup")}
                            />
                        </aside>
                    </div>
                </main>

                <footer className="login-footer-container">
                    <p>&copy; 2024 Pawbook</p>
                </footer>
            </div>
        </>
    )

};

export default LoginPage;