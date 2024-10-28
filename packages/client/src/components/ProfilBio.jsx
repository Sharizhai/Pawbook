import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import Button from './Button';
import FloatingMenu from './FloatingMenu';
import SettingsButton from "./SettingsButton";
import AuthService from '../services/auth.service';
import ProfilUpdatePanel from './ProfilUpdatePanel';
import Profil_image from "../assets/Profil_image_2.png";
import authenticatedFetch from '../services/api.service';
import floatingMenusData from "../data/floatingMenusData.json"

import "../css/ProfilBio.css";

const ProfilBio = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    // Pour que l'affichage du profil soit adapté, on récupère l'ID de l'user depuis l'URL
    const { id: urlUserId } = useParams();
    const [user, setUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isUpadateProfilePanelOpen, setIsUpadateProfilePanelOpen] = useState(false);

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
                            popup: `animate__animated animate__fadeInDown animate__faster`
                        },
                        hideClass: {
                            popup: `animate__animated animate__fadeOutUp animate__faster`
                        }
                    });
                    return;
                }

                const verifyLoginData = await verifyLoginResponse.json();
                const currentId = verifyLoginData.data;
                setCurrentUserId(currentId);

                const profileId = urlUserId || currentId;

                const userResponse = await fetch(`${API_URL}/users/${profileId}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${AuthService.getToken()}`
                    },
                });

                if (!userResponse.ok) {
                    throw new Error("Erreur lors de la récupération des données utilisateur");
                }

                const userData = await userResponse.json();
                setUser(userData.data);
                console.log("Données du profil récupérées:", userData.data);

                // Vérification du statut de follow si on consulte un autre profil
                if (urlUserId && urlUserId !== currentId) {
                    const isAlreadyFollowing = userData.data.followers.some(
                        follower => follower.followerUser._id === currentId
                    );
                    console.log("Est-ce que je suis cet utilisateur ?", isAlreadyFollowing);
                    setIsFollowing(isAlreadyFollowing);
                }

            } catch (error) {
                console.error("Erreur:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [API_URL, urlUserId, navigate]);

    const handleFollow = async () => {
        if (isLoadingFollow) return;
        setIsLoadingFollow(true);

        try {
            if (!isFollowing) {
                // Créer un nouveau follow
                const response = await authenticatedFetch(`${API_URL}/follows/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        followerUser: currentUserId,
                        followedUser: user._id
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'ajout du follow');
                }
            } else {
                // Récupérer et supprimer le follow existant
                const follow = user.followers.find(
                    follower => follower.followerUser._id === currentUserId
                );

                if (follow) {
                    const deleteResponse = await authenticatedFetch(`${API_URL}/follows/${currentUserId}/${user._id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Erreur lors de la suppression du follow');
                        //TODO add toast 
                    }
                }
            }

            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Erreur lors de la modification du suivi:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la modification du suivi',
                background: "#DEB5A5",
                position: "top",
                confirmButtonColor: "#d33",
                color: "#001F31",
                timer: 3000,
                showConfirmButton: false,
                toast: true
            });
        } finally {
            setIsLoadingFollow(false);
        }
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!user) {
        return <div>Aucun utilisateur trouvé</div>;
    }

    const handleProfilePanelOpen = () => {
        setIsUpadateProfilePanelOpen(true);
    };

    const handleProfilePanelClose = () => {
        setIsUpadateProfilePanelOpen(false);
    };

    const handleFloatingMenuOpen = () => {
        setIsFloatingMenuOpen(true);
    };

    const handleFloatingMenuClose = () => {
        setIsFloatingMenuOpen(false);
    };

    const handleSettingsButtonClick = async (action) => {
        switch (action) {
            case "updateProfil":
                handleProfilePanelOpen();
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
                    //TODO : add toast
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

    const renderButtons = () => {
        if (currentUserId === user?._id) {
            // Si c'est notre propre profil => on affiche les boutons Followers et Suivi(e)s
            return (
                <>
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
                </>
            );
        } else {
            // Si c'est le profil de quelqu'un d'autre => on affiche uniquement le bouton Suivre/Suivi(e)
            return (
                <Button
                    className={`bio-follow-button ${isFollowing ? 'followed' : ''}`}
                    label={isLoadingFollow ? 'Chargement...' : isFollowing ? 'Suivi(e)' : 'Suivre'}
                    onClick={handleFollow}
                    disabled={isLoadingFollow}
                />
            );
        }
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
                    {renderButtons()}
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

                {isUpadateProfilePanelOpen && (
                    <ProfilUpdatePanel
                        onClose={handleProfilePanelClose}
                        user={user}
                    />
                )}

            </div>
        </>
    )
};

export default ProfilBio;