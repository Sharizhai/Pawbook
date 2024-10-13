import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Button from "./Button";
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png"

import "../css/ProfilBio.css";

const ProfilBio = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {         
            try {
                const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
            });
            
                if (!verifyLoginResponse.ok) {
                    console.error("Utilisateur non connecté")
                    return;
                }

                const verifyLoginData = await verifyLoginResponse.json();
                const userId = verifyLoginData;

                const userResponse = await fetch(`${API_URL}/users/${userId.data}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!userResponse.ok) {
                    throw new Error("Erreur lors de la récupération des données utilisateur en front");
                }

                const userData = await userResponse.json();
                
                setUser(userData.data);
            } catch (error) {
                console.error("Erreur:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [API_URL]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!user) {
        return <div>Aucun utilisateur trouvé</div>;
    }

    return (
        <>
            <div className="bio-main-container">
                <SettingsButton className="bio-settings-button"/>
                
                <div className="bio-infos">
                    <div className="bio-profil-picture-container">
                        <img src={user.profilePicture} alt="Image de profil de " className="bio-profil-picture" />
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
                        onClick={() => navigate("/followers")}
                    />

                    <Button
                        className="bio-follows-button"
                        label="Suivi(e)s"
                        onClick={() => navigate("/follows")}
                    />
                </div>

            </div>
        </>
    )

};

export default ProfilBio;