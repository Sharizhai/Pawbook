import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import Button from './Button';
import FloatingMenu from './FloatingMenu';
import SettingsButton from "./SettingsButton";
import AuthService from '../services/auth.service';
import Profil_image from "../assets/Profil_image_2.png"
import authenticatedFetch from '../services/api.service';
import floatingMenusData from "../data/floatingMenusData.json"

import "../css/ProfilBio.css";

const ProfilBio = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    // Pour que l'affichage du profil soit adapté, on récupère l'ID de l'user depuis l'URL
    const { id: urlUserId  } = useParams();
    const [user, setUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const menuItems = currentUserId === user?._id
        ? floatingMenusData.profile.user
        : floatingMenusData.profile.other;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${AuthService.getToken()}`
                    },
                    credentials: "include",
                });

                if (!verifyLoginResponse.ok) {
                    console.error("Utilisateur non connecté")
                    navigate("/login");
                    Swal.fire({
                        icon: 'warning',
                        title: 'Vous n\'êtes pas connecté',
                        text: 'Veuillez saisir vos identifiants afin de vous connecter',
                        background: "#DEB5A5",
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
                    return;
                }

                const verifyLoginData = await verifyLoginResponse.json();
                setCurrentUserId(verifyLoginData.data);

                // Récupérer les données de l'utilisateur du profil (celui dans l'URL ou l'utilisateur actuel)
                const profileId  = urlUserId || verifyLoginData.data;

                const userResponse = await fetch(`${API_URL}/users/${profileId }`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });

                if (!userResponse.ok) {
                    throw new Error("Erreur lors de la récupération des données utilisateur en front");
                    //TODO: add toast
                }

                const profileData = await userResponse.json();
                console.log("Données du profil récupérées:", profileData);
                console.log("id de l'url :", urlUserId)

                setUser(profileData.data);
            } catch (error) {
                console.error("Erreur:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [API_URL, urlUserId, navigate]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!user) {
        return <div>Aucun utilisateur trouvé</div>;
    }

    const handleFloatingMenuOpen = () => {
        setIsFloatingMenuOpen(true);
    };

    const handleFloatingMenuClose = () => {
        setIsFloatingMenuOpen(false);
    };

    const handleSettingsButtonClick = async (action) => {
        switch (action) {
            case "updateProfil":
                // TODO :
                // Ajouter logique pour la modification du profil
                break;

            case "openCGU":
                navigate("/gcu");
                break;

            case "delete":
                Swal.fire({
                    icon: 'warning',
                    title: 'Confirmez-vous la suppression de votre compte ?',
                    background: "#DEB5A5",
                    position: "center",
                    showConfirmButton: true,
                    confirmButtonColor: "#A60815",
                    confirmButtonText: 'Supprimer',
                    showCancelButton: true,
                    cancelButtonColor: "#45525A",
                    cancelButtonText: 'Annuler',
                    color: "#001F31",
                    toast: true,
                    customClass: {
                        background: 'swal-background'
                    },
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
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${AuthService.getToken()}`
                                },
                                credentials: "include",
                            });

                            if (!verifyLoginResponse.ok) {
                                console.error("Utilisateur non connecté")
                                navigate("/login");
                                return;
                            }

                            const verifyLoginData = await verifyLoginResponse.json();
                            const userId = verifyLoginData;
                            const response = await fetch(`${API_URL}/users/${userId.data}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: "include",
                            });

                            if (response.ok) {
                                navigate("/");
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Votre compte a été supprimé avec succès.',
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
                                console.error("La suppression du compte a échoué");
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erreur',
                                    text: 'Une erreur s\'est produite lors de la suppression de votre compte.',
                                    background: "#DEB5A5",
                                    confirmButtonColor: "#d33",
                                    color: "#001F31",
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
                        } catch (error) {
                            console.error("Erreur lors de la suppression du compte:", error);
                            console.error("La suppression du compte a échoué");
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: 'Une erreur s\'est produite.Veuillez réessayer',
                                background: "#DEB5A5",
                                confirmButtonColor: "#d33",
                                color: "#001F31",
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
                    }
                });
                break;

            case "disconnect":
                try {
                    const response = await fetch(`${API_URL}/users/logout`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    if (response.ok) {
                        navigate("/login");
                    } else {
                        console.error("La déconnexion a échoué")
                    }
                } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    setError("Une erreur s'est produite lors de la déconnexion. Veuillez réessayer.");
                }
                console.log("Utilisateur déconnecté");
                break;

                case "reportUser":
                // TODO :
                // Ajouter logique pour signaler un post
                break;

                case "reportUserName":
                // TODO :
                // Ajouter logique pour signaler un post
                break;

                case "reportPicture":
                // TODO :
                // Ajouter logique pour signaler un post
                break;

            default:
                console.log("Action not implemented:", action);
        }
        setIsFloatingMenuOpen(false);
    };

    return (
        <>
            <div className="bio-main-container">
                <SettingsButton className="bio-settings-button"
                    onClick={handleFloatingMenuOpen} />


                <div className="bio-infos">
                    <div className="bio-profil-picture-container">
                        <img src={user.profilePicture || Profil_image} alt={`Image de profil de ${user.firstName} ${user.name}`} className="bio-profil-picture" />
                    </div>
                    <div className="bio-name-summary">
                        <p className="name-and-firstname">{user.firstName} {user.name}</p>
                        <p className="bio-summary">{user.profileDescription}</p>
                    </div>
                </div>

                <div className="bio-buttons-container">
                    <Button
                        className="bio-followers-button"
                        label="Followers"
                        onClick={() => navigate(`/followers/${user?._id}`)}
                    />

                    <Button
                        className="bio-follows-button"
                        label="Suivi(e)s"
                        onClick={() => navigate(`/follows/${user?._id}`)}
                    />
                </div>

                {isFloatingMenuOpen && (
                    <FloatingMenu onClose={handleFloatingMenuClose}>
                        {menuItems.map((item, index) => (
                            <Button
                                key={index}
                                label={item.label}
                                onClick={() => handleSettingsButtonClick(item.action)}
                                className={item.className}
                            />
                        ))}
                    </FloatingMenu>
                )}

            </div>
        </>
    )
};

export default ProfilBio;