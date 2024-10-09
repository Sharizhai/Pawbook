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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/users/:id`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    console.error("Erreur lors de la récupération des données utilisateur");
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <div>Chargement...</div>;
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
                        <p className="bio-summary">user.profileDescription</p>
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