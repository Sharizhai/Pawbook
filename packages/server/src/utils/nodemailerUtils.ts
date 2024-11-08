import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const LOGO_URL = process.env.LOGO_URL;

// Configuration pour nodemailer
export const emailConfig = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Template d'email
export const createResetPasswordEmail = (resetLink: string) => {
  return {
    subject: "Réinitialisation de votre mot de passe Pawbook",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="${LOGO_URL}" alt="Pawbook Logo" style="max-width: 50px;">
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <h1 style="color: #001F31;">Réinitialisation de votre mot de passe</h1>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe sur Pawbook.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #DEB5A5; 
                    color: #001F31; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color: #666;">Ce lien expirera dans 1 heure.</p>
        <p style="color: #666;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 12px;">L'équipe Pawbook</p>
      </div>
    `
  };
};

// Fonction pour envoyer l'email
export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  try {
    const emailTemplate = createResetPasswordEmail(resetLink);
    
    await emailConfig.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });
    
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};