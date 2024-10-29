import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import SettingsButton from "./SettingsButton";
import FloatingMenu from "./FloatingMenu";
import Swal from 'sweetalert2';
import 'animate.css';

import floatingMenusData from "../data/floatingMenusData.json"
import authenticatedFetch from '../services/api.service';
import Profil_image from "../assets/Profil_image_2.png";
import AuthService from '../services/auth.service';
import Button from './Button';

import '../css/AnimalCard.css';
import useAnimalStore from "../stores/animalStore";

const AnimalCard = ({ animal, onEditClick, currentUserId }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const menuItems = currentUserId === animal.ownerId
        ? floatingMenusData.animal.user
        : floatingMenusData.animal.other;

    const handleFloatingMenuOpen = () => {
        setIsFloatingMenuOpen(true);
    };

    const handleFloatingMenuClose = () => {
        setIsFloatingMenuOpen(false);
    };

    const handleSettingsButtonClick = async (action) => {
        switch (action) {
            case "updateAnimal":
                handleProfilePanelOpen();
                onEditClick(animal)
                break;

            case "deleteAnimal":
                Swal.fire({
                    icon: 'warning',
                    title: 'Confirmez-vous la suppression de cet animal ?',
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
                            const ownerId = verifyLoginData.data;
                            const animalId = animal._id;

                            console.log(ownerId, animalId);

                            const response = await fetch(`${API_URL}/animals/${animalId}/${ownerId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${AuthService.getToken()}`
                                },
                                credentials: "include",
                            });

                            if (response.ok) {
                                useAnimalStore.getState().deleteAnimal(animalId, true);

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Le profil de votre animal a bien été supprimé.',
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
                                console.error("La suppression de votre animal a échoué");
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

            case "reportAnimal":
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
        <div className="animal-card-container">
            <SettingsButton className="animal-card-settings-button"
                onClick={handleFloatingMenuOpen} />
            <div className="animal-card-photo-and-resume">
                <div className="animal-card-profil-picture-container">
                    <img
                        src={animal.picture || Profil_image}
                        alt={`Image de ${animal.name}`}
                        className="animal-card-profil-picture"
                    />
                </div>
                <div className="animal-card-resume-container">
                    <h3 className="animal-card-name-label">{animal.name}</h3>
                    <h4 className="animal-card-infos-label">
                        {`${animal.race}, ${animal.type}${animal.age ? `, ${animal.age} ans` : ''}`}
                    </h4>
                    <p className="animal-card-bio-text">{animal.description}</p>
                </div>
            </div>
            <button className="animal-card-like-button">
                <span className="material-symbols-outlined">favorite</span>
            </button>

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
    );
};

export default AnimalCard;