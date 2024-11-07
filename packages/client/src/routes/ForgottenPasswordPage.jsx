import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'animate.css';

import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

import '../css/ForgottenPasswordPage.css';

const ForgottenPasswordPage = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendEmail = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Veuillez renseigner une adresse e-mail valide.");
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      const response = await fetch(`${API_URL}/passwords/forgotten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: "include"
      });

      if (response.ok) {
        Swal.fire({
          background: "#DEB5A5",
          text: "Si l'adresse renseignée se trouve dans notre base de données, vous recevrez prochainement un e-mail vous permettant de réinitialiser votre mot de passe. Pensez à vérifier vos spams.",
          position: "top",
          confirmButtonColor: "#EEE7E2",
          color: "#001F31",
          timer: 5000,
          showConfirmButton: false,
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
        setEmail('');
      } else {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.',
        confirmButtonColor: "#DEB5A5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="forgotten-password-page-container">
        <main className="forgotten-password-main-container">
          <header className="forgotten-password-header-container">
            <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="home-logo" />
            <h1 className="website-name forgotten-password-logo-title">Pawbook</h1>
            <p className="forgotten-password-subheading">Le premier réseau social pour les amoureux des animaux</p>
          </header>
          <div className="form-aside-container">
            <form className="forgotten-password-form">
              <BackButton />
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Entrez votre e-mail"
                disabled={isLoading}
              />
              {emailError && <p className="forgotten-password-error-message">{emailError}</p>}
              <Button
                className="forgotten-password-btn"
                label={isLoading ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
                onClick={handleSendEmail}
                disabled={isLoading}
              />
            </form>
          </div>
        </main>
        <footer className="forgotten-password-footer-container">
          <p>&copy; 2024 Pawbook</p>
        </footer>
      </div>
    </>
  );
};

export default ForgottenPasswordPage;