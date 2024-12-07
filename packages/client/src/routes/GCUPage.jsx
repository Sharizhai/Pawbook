import React, {  useEffect } from 'react';

import '../css/global.css';
import "../css/GCUPage.css";

import BackButton from '../components/BackButton';

const GCUPage = () => {
    const LOGO = import.meta.env.VITE_LOGO_URL;

    useEffect(() => {
        document.title = "Conditions Générales d'Utilisation - Pawbook";
        
        const metaTags = [
          { name: 'robots', content: 'noindex, nofollow' },
          { name: 'description', content: 'Conditions Générales d\'Utilisation de Pawbook' }
        ];
    
        metaTags.forEach(tag => {
          const metaTag = document.createElement('meta');
          Object.keys(tag).forEach(key => metaTag.setAttribute(key, tag[key]));
          document.head.appendChild(metaTag);
        });
    
        return () => {
          metaTags.forEach(tag => {
            const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
            if (existingTag) existingTag.remove();
          });
        };
      }, []);

    return (
        <>
            <div className="gcu-main-panel-container">
                <BackButton className="gcu-back-button" />

                <header className="gcu-header-container">
                    <img src={`${LOGO}`} alt="Logo du site Pawbook" className="gcu-logo" />
                </header>

                <main className="gcu-main-container">

                    <h1 className="website-name gcu-logo-title">Conditions Générales d'Utilisation</h1>

                    <section className="gcu-scrollview">
                        <p>Date d'entrée en vigueur : 17 juin 2024</p>
                        <p>Mise à jour : 07 décembre 2024</p><br />

                        <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de notre plateforme et de nos services. En accédant à Pawbook, vous acceptez de vous conformer aux présentes CGU. Si vous n'acceptez pas ces termes, veuillez ne pas utiliser notre site ou nos services.</p><br /><br />

                        <h2>1. Définitions</h2><br />

                        <p>- <strong>Utilisateur</strong> : toute personne physique ou morale utilisant la plateforme Pawbook.<br />
                            - <strong>Contenu</strong> : ensemble des éléments (texte, images, vidéos, etc.) publiés sur Pawbook.<br />
                            - <strong>Compte</strong> : l'espace personnel créé par l'Utilisateur sur Pawbook pour accéder aux services.
                        </p><br /><br />

                        <h2>2. Objet</h2><br />

                        <p>Les présentes CGU définissent les modalités d'utilisation de la plateforme Pawbook ainsi que les droits et obligations des Utilisateurs et de Pawbook.</p><br /><br />

                        <h2>3. Accès et inscription</h2><br />

                        <p><strong>3.1. Accès à la plateforme</strong><br />
                            L'accès à Pawbook est ouvert à toute personne disposant d'une connexion Internet. Certaines fonctionnalités, comme la publication de contenu ou l'interaction avec d'autres Utilisateurs, nécessitent cependant la création d'un compte.</p><br />

                        <p><strong>3.2. Inscription</strong><br />
                            Pour utiliser les services de Pawbook, l'Utilisateur doit créer un compte en fournissant des informations exactes et à jour. L'Utilisateur s'engage à maintenir la confidentialité de son mot de passe et à informer Pawbook en cas d'utilisation non autorisée de son compte. Pawbook se réserve le droit de suspendre ou de résilier un compte en cas de non-respect des présentes CGU.</p><br /><br />

                        <h2>4. Utilisation des services</h2><br />

                        <p><strong>4.1. Publication de contenu</strong><br />
                            Les Utilisateurs peuvent publier du Contenu sur Pawbook. Ils s'engagent à ne pas publier de contenu illicite, offensant, diffamatoire ou portant atteinte aux droits des tiers, et à respecter les lois en vigueur.</p><br />

                        <p><strong>4.2. Responsabilité du Contenu</strong><br />
                            L’Utilisateur est seul responsable du Contenu qu'il publie sur Pawbook. Pawbook décline toute responsabilité en cas d’utilisation abusive ou de préjudices causés par le Contenu publié.</p><br /><br />

                        <h2>5. Propriété intellectuelle</h2><br />

                        <p><strong>5.1. Contenu de Pawbook</strong><br />
                            Pawbook et ses éléments constitutifs (textes, images, logos, etc.) sont protégés par les droits de propriété intellectuelle. Toute reproduction, distribution ou utilisation de ces éléments sans autorisation écrite de Pawbook est strictement interdite.</p><br />

                        <p><strong>5.2. Contenu des Utilisateurs</strong><br />
                            En publiant du Contenu sur Pawbook, l'Utilisateur concède à Pawbook une licence non exclusive, mondiale et gratuite pour utiliser, reproduire, modifier et promouvoir ce Contenu dans le cadre du fonctionnement des services.</p><br /><br />

                        <h2>6. Protection des données personnelles</h2><br />

                        <p>Pawbook s'engage à respecter la vie privée des Utilisateurs et à protéger leurs données personnelles conformément à la réglementation en vigueur, notamment le RGPD.</p><br /><br />

                        <h2>7. Limitation de responsabilité</h2><br />

                        <p>Pawbook met tout en œuvre pour garantir la disponibilité et la sécurité de la plateforme. Toutefois, Pawbook ne peut garantir une utilisation ininterrompue ou sans erreur. Pawbook décline toute responsabilité en cas de pertes ou dommages découlant de l'utilisation de la plateforme.</p><br /><br />

                        <h2>8. Modifications des CGU</h2><br />

                        <p>Pawbook se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés des modifications par tout moyen approprié. L'utilisation continue de la plateforme après notification vaut acceptation des CGU modifiées.</p><br /><br />

                        <h2>9. Résiliation</h2><br />

                        <p>Pawbook se réserve le droit de suspendre ou de résilier l'accès à la plateforme à tout Utilisateur en cas de non-respect des présentes CGU, ou pour tout autre motif légitime.</p><br /><br />

                        <h2>10. Droit applicable et juridiction compétente</h2><br />

                        <p>Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux français.</p><br /><br />

                        <h2>11. Contact</h2><br />

                        <p>Pour toute question relative aux présentes CGU, veuillez nous contacter à l'adresse suivante : <a href="mailto:pawbook.contact@gmail.com">pawbook.contact@gmail.com</a>.</p><br />

                        <p>En utilisant Pawbook, vous confirmez avoir lu, compris et accepté les présentes Conditions Générales d'Utilisation. Nous vous remercions de votre confiance et vous souhaitons une agréable expérience sur notre plateforme.</p><br />

                        <p><strong>L’équipe Pawbook</strong></p>

                    </section>
                </main>
                <footer className="gcu-footer-container">
                    <p>&copy; 2024 Pawbook</p>
                </footer>
            </div>

        </>
    )
};

export default GCUPage;