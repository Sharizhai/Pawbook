import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/global.css';
import '../css/HomePage.css';

import Button from '../components/Button';

const HomePage = () => {
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();

    return (
        <>
            <main className="home-main-container">
                <header className="home-header-container">
                    <img src={`${LOGO}`} alt="Logo du site Pawbook" className="home-logo" />
                    <h1 className="website-name home-logo-title">Pawbook</h1>
                    <p className="home-subheading">Le premier réseau social pour les amoureux des animaux</p>
                </header>

                <nav className="home-buttons-container">
                    <Button
                        label="Se connecter"
                        onClick={() => navigate("/login")}
                    />

                    <Button
                        label="Créer un compte"
                        onClick={() => navigate("/signup")}
                    />
                </nav>
            </main>

            <footer className="home-footer-container">
                <a href="/gcu">Conditions Générales d'Utilisation</a>
                <p>&copy; 2024 Pawbook</p>
            </footer>
        </>
    )
};

export default HomePage;