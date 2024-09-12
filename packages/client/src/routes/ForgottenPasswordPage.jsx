import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'animate.css';

import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

import '../css/ForgottenPasswordPage.css';

const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleResetPassword = () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Veuillez renseigner une adresse e-mail valide.");
      return;
    }
    setEmailError('');
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
        popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutUp
          animate__faster
        `
      }
    });
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
              />
              {emailError && <p className="forgotten-password-error-message">{emailError}</p>}
              <Button
                className="forgotten-password-btn"
                label="Réinitialiser mon mot de passe"
                onClick={handleResetPassword}
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