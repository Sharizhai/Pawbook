import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'animate.css';

import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

import '../css/ResetPasswordPage.css';

const ResetPasswordPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            navigate('/');
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Lien de réinitialisation invalide ou expiré',
                confirmButtonColor: "#DEB5A5",
            });
        }
    }, [searchParams, navigate]);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return "Le mot de passe doit contenir au moins 8 caractères";
        }
        if (!hasUpperCase || !hasLowerCase) {
            return "Le mot de passe doit contenir des majuscules et des minuscules";
        }
        if (!hasNumbers) {
            return "Le mot de passe doit contenir au moins un chiffre";
        }
        if (!hasSpecialChar) {
            return "Le mot de passe doit contenir au moins un caractère spécial";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleResetPassword = async () => {
        const newPasswordError = validatePassword(passwordData.newPassword);
        const confirmError = passwordData.newPassword !== passwordData.confirmPassword
            ? "Les mots de passe ne correspondent pas"
            : "";

        setErrors({
            newPassword: newPasswordError,
            confirmPassword: confirmError
        });

        if (newPasswordError || confirmError) return;

        setIsLoading(true);
        const token = searchParams.get('token');

        try {
            const response = await fetch(`${API_URL}/passwords/reset/${token}`, {
                method: 'POST',
                body: JSON.stringify({ newPassword: passwordData.newPassword }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Votre mot de passe a été réinitialisé avec succès',
                    confirmButtonColor: "#DEB5A5",
                }).then(() => {
                    navigate('/login');
                });
            } else {
                throw new Error('Erreur lors de la réinitialisation du mot de passe');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
                confirmButtonColor: "#DEB5A5",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="reset-password-page-container">
                <main className="reset-password-main-container">
                    <header className="reset-password-header-container">
                        <img src={`${LOGO}`} alt="Logo du site Pawbook" className="home-logo" />
                        <h1 className="website-name reset-password-logo-title">Pawbook</h1>
                        <p className="reset-password-subheading">Le premier réseau social pour les amoureux des animaux</p>
                    </header>
                    <div className="form-aside-container">
                        <form className="reset-password-form" onSubmit={(e) => e.preventDefault()}>
                            <BackButton redirectTo="/" />
                            <Input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleChange}
                                placeholder="Entrez votre nouveau mot de passe"
                                disabled={isLoading}
                            />
                            {errors.newPassword && <p className="reset-password-error-message">{errors.newPassword}</p>}
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmez votre nouveau mot de passe"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <p className="reset-password-error-message">{errors.confirmPassword}</p>}
                            <Button
                                className="reset-password-btn"
                                label={isLoading ? "Réinitialisation en cours..." : "Réinitialiser mon mot de passe"}
                                onClick={handleResetPassword}
                                disabled={isLoading}
                            />
                        </form>
                    </div>
                </main>
                <footer className="reset-password-footer-container">
                    <p>&copy; 2024 Pawbook</p>
                </footer>
            </div>
        </>
    );
};

export default ResetPasswordPage;