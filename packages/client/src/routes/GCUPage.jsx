import { useState } from 'react';

import '../css/global.css';
import "../css/GCUPage.css";

import BackButton from '../components/BackButton';

const GCUPage = () => {
    const LOGO = import.meta.env.VITE_LOGO_URL;

    // const [isChecked, setIsChecked] = useState(false);
    // const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // const handleCheckboxChange = (event) => {
    //     setIsChecked(event.target.checked);
    //     if (event.target.checked) {
    //         setAttemptedSubmit(false);
    //     }
    // };

    // const handleSubmit = () => {
    //     if (!isChecked) {
    //         setAttemptedSubmit(true);
    //         console.log('Attempted submit without checkbox checked');
    //     } else {
    //         console.log('Je valide les CGU');

    //         //Ajouter le code pour le changement de page.  (navigate('/next-page');)
    //     }
    // };

    return (
        <>
            <div className="gcu-main-panel-container">
            <BackButton className="gcu-back-button"/>

                <header className="gcu-header-container">
                    <img src={`${LOGO}`} alt="Logo du site Pawbook" className="gcu-logo" />
                </header>

                <main className="gcu-main-container">

                    <h1 className="website-name gcu-logo-title">Conditions Générales d'Utilisation</h1>

                    <section className="gcu-scrollview">
                        <p>Date d'entrée en vigueur : 17 juin 2024</p><br />

                        <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de notre plateforme et de nos services. En accédant à Pawbook, vous acceptez de vous conformer aux présentes CGU. Si vous n'acceptez pas ces termes, veuillez ne pas utiliser notre site ou nos services.</p><br /><br />

                        <h2>1. Définitions</h2><br />

                        <p>- <strong>Utilisateur</strong> : toute personne physique ou morale utilisant la plateforme Pawbook.<br />
                            - <strong>Contenu</strong> : ensemble des éléments (texte, images, vidéos, etc.) publiés sur Pawbook.<br />
                            - <strong>Compte</strong> : l'espace personnel créé par l'Utilisateur sur Pawbook pour accéder aux services.
                        </p><br /><br />

                        <h2>2. Objet</h2><br />

                        <p>Les présentes CGU ont pour objet de définir les modalités d'utilisation de la plateforme Pawbook et les droits et obligations des Utilisateurs et de Pawbook.</p><br /><br />

                        <h2>3. Accès et inscription</h2><br />

                        <p>3.1. <strong>Accès à la plateforme</strong><br />
                            L'accès à Pawbook est ouvert à toute personne ayant accès à internet. Toutefois, certaines fonctionnalités sont réservées aux Utilisateurs inscrits.</p><br />

                        <p>3.2. <strong>Inscription</strong><br />
                            Pour utiliser les services de Pawbook, l'Utilisateur doit créer un compte en fournissant des informations exactes et à jour. L'Utilisateur s'engage à maintenir la confidentialité de son mot de passe et à informer Pawbook en cas d'utilisation non autorisée de son compte.</p><br /><br />

                        <h2>4. Utilisation des services</h2><br />

                        <p>4.1. <strong>Publication de contenu</strong><br />
                            Les Utilisateurs peuvent publier du Contenu sur Pawbook. Ils s'engagent à ne pas publier de contenu illicite, offensant, diffamatoire, ou portant atteinte aux droits des tiers.</p><br />

                        <p>4.2. <strong>Responsabilité du Contenu</strong><br />
                            L’Utilisateur est seul responsable du Contenu qu'il publie sur Pawbook. Pawbook ne peut être tenu responsable des contenus publiés par les Utilisateurs.</p><br /><br />

                        <h2>5. Propriété intellectuelle</h2><br />

                        <p>5.1. <strong>Contenu de Pawbook</strong><br />
                            Pawbook et ses éléments constitutifs (textes, images, logo, etc.) sont protégés par les droits de propriété intellectuelle. Toute reproduction, distribution ou utilisation de ces éléments sans l’autorisation de Pawbook est interdite.</p><br />

                        <p>5.2. <strong>Contenu des Utilisateurs</strong><br />
                            L'Utilisateur concède à Pawbook une licence non exclusive, mondiale et gratuite pour utiliser, reproduire, afficher, adapter, modifier, distribuer et promouvoir le Contenu publié sur la plateforme.</p><br /><br />

                        <h2>6. Protection des données personnelles</h2><br />

                        <p>Pawbook s'engage à respecter la vie privée des Utilisateurs et à protéger leurs données personnelles conformément à la réglementation en vigueur. Pour plus de détails, veuillez consulter notre Politique de Confidentialité.</p><br /><br />

                        <h2>7. Limitation de responsabilité</h2><br />

                        <p>Pawbook met tout en œuvre pour assurer la disponibilité et la sécurité de la plateforme. Toutefois, Pawbook ne peut garantir que les services seront exempts d'erreurs ou d'interruptions.</p><br /><br />

                        <h2>8. Modifications des CGU</h2><br />

                        <p>Pawbook se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés de ces modifications par tout moyen approprié. L'utilisation continue de Pawbook après modification des CGU vaut acceptation de ces dernières.</p><br /><br />

                        <h2>9. Résiliation</h2><br />

                        <p>Pawbook se réserve le droit de suspendre ou de résilier l'accès à la plateforme à tout Utilisateur en cas de non-respect des présentes CGU.</p><br /><br />

                        <h2>10. Droit applicable et juridiction compétente</h2><br />

                        <p>Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des tribunaux français.</p><br /><br />

                        <h2>11. Contact</h2><br />

                        <p>Pour toute question relative aux présentes CGU, veuillez nous contacter à : [adresse email de contact].</p><br />

                        <p>En utilisant Pawbook, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales d'Utilisation. Nous vous remercions de votre confiance et vous souhaitons une agréable expérience sur notre plateforme.</p><br />

                        <p><strong>L’équipe Pawbook</strong></p>
                    </section>

                    {/* <div className={`cgu-acceptance ${attemptedSubmit && !isChecked ? "error" : ""}`}>
                        <input
                            type="checkbox"
                            id="accept-cgu"
                            name="accept-cgu"
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="accept-cgu">
                            J'accepte les Conditions Générales d'Utilisation
                        </label>
                    </div>

                    <Button
                        type="submit"
                        label="Valider"
                        onClick={handleSubmit}
                    /> */}
                </main>
                <footer className="gcu-footer-container">
                    <p>&copy; 2024 Pawbook</p>
                </footer>
            </div>

        </>
    )
};

export default GCUPage;