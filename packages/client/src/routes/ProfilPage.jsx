import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import 'animate.css';

import usePostStore from "../stores/postStore";
import ProfilBio from "../components/ProfilBio";
import useAnimalStore from "../stores/animalStore";
import AuthService from '../services/auth.service';
import authenticatedFetch from '../services/api.service';
import ProfilTabulation from "../components/ProfilTabulation";

import '../css/ProfilPage.css';

const ProfilPage = ({ openPostPanel }) => {

    const API_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { id: urlUserId } = useParams();
    
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!verifyLoginResponse.ok) {
                    navigate("/login");
                    return;
                }

                const verifyLoginData = await verifyLoginResponse.json();
                const currentId = verifyLoginData.data;
                setCurrentUserId(currentId);

                const profileId = urlUserId || currentId;

                const userResponse = await fetch(`${API_URL}/users/${profileId}`, {
                    method: "GET",
                    credentials: "include"
                });

                if (!userResponse.ok) {
                    throw new Error("Erreur lors de la récupération des données utilisateur");
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
    }, [API_URL, urlUserId, navigate, refreshKey]);

    const handleProfileUpdate = () => {
        setRefreshKey(prevKey => prevKey + 1);
        usePostStore.getState().fetchUserPosts(user._id);
        useAnimalStore.getState().fetchAnimalsByOwnerId(user._id);
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error}</div>;
    if (!user) return <div>Aucun utilisateur trouvé</div>;

    return (
        <>
            <div className="profil-page-container">
                <ProfilBio
                    user={user}
                    currentUserId={currentUserId}
                    onProfileUpdate={handleProfileUpdate}
                />
                <ProfilTabulation 
                    user={user}
                    currentUserId={currentUserId}
                    openPostPanel={openPostPanel}
                    urlUserId={urlUserId}
                />
            </div>      
        </>
    )

};

export default ProfilPage;