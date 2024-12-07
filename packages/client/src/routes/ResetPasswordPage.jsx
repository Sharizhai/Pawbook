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
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: 'warning',
                text: "Les mots de passe ne correspondent pas",
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

        setIsLoading(true);
        const token = searchParams.get('token');

        try {
            const response = await fetch(`${API_URL}/passwords/reset/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword: passwordData.newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    text: "Votre mot de passe a été réinitialisé avec succès",
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
                }).then(() => {
                    navigate('/login');
                });
            } else {
                if (!response.ok) {
                    if (data.data && Array.isArray(data.data)) {
                        const errorMessages = data.data
                            .map(error => error.message)
                            .join("\n");

                        Swal.fire({
                            icon: "error",
                            title: "Votre mot de passe n'a pas été réinitialisé",
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
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur réseau est survenue',
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