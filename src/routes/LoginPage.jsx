import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import '../css/global.css';
import '../css/LoginPage.css';

import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return (
        <>
            <div className="login-page-container">
                <main className="login-main-container">
                    <header className="login-header-container">
                        <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="home-logo" />
                        <h1 className="website-name login-logo-title">Pawbook</h1>
                        <p className="login-subheading">Le premier réseau social pour les amoureux des animaux</p>
                    </header>

                    <div className="form-aside-container">
                        <form className="login-form">
                            <BackButton />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Entrez votre email"
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
                                onClick={() => navigate("/newsfeed")}
                            />
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