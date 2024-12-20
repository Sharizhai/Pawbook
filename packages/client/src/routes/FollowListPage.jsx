import { useLocation, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import authenticatedFetch from '../services/api.service';
import BackButton from '../components/BackButton';
import FollowCard from '../components/FollowCard';

import styles from "../styles/pages/FollowListPage.module.scss";
//import '../css/FollowListPage.css';

const FollowListPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const { id } = useParams();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);

    const isFollowers = location.pathname.startsWith("/followers");

    useEffect(() => {      
        fetchUsersAndCurrentUser();
    }, [isFollowers]);

    const fetchUsersAndCurrentUser = async () => {
        try {
            const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!verifyLoginResponse.ok) return;

            const verifyLoginData = await verifyLoginResponse.json();
            const currentId = verifyLoginData.data;
            setCurrentUserId(currentId);

            const userResponse = await authenticatedFetch(`${API_URL}/users/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!userResponse.ok) {
                throw new Error("Erreur lors de la récupération des données utilisateur en front");
                //TODO: add toast
            }

            const userData = await userResponse.json();
            const selectedUsers = isFollowers ? userData.data.followers : userData.data.follows;

            setUsers(selectedUsers);
            setCount(selectedUsers.length);

        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleFollowChange = () => {
        fetchUsersAndCurrentUser(); // Rafraîchir la liste après un changement de suivi
    };

    // Si l'ID de l'utilisateur n'est pas encore chargé, on peut afficher un loader
    if (!currentUserId) {
        //TODO : intégrer loader
        return <div>Chargement...</div>;
    }

    return (
        <div className={styles.followMainContainer}>
            <BackButton className={styles.followBackButton} />
            <header>
                <h1 className={styles.followPageTitle}>
                    {isFollowers ? 'Followers' : 'Suivi(e)s'}
                </h1>
                <p className={styles.followPageSubhead}>
                    {isFollowers
                        ? `${count} personne${count > 1 ? 's' : ''} vous sui${count > 1 ? 'vent' : 't'}`
                        : `Vous suivez ${count} personne${count > 1 ? 's' : ''}`}
                </p>
            </header>
            <main>
                {users.map(user => (
                    <FollowCard
                        key={user._id}
                        user={isFollowers ? user.followerUser : user.followedUser}
                        currentUserId={currentUserId}
                        onFollowChange={handleFollowChange}
                    />
                ))}
            </main>
        </div>
    );
};

export default FollowListPage;