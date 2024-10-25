import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import BackButton from '../components/BackButton';
import FollowCard from '../components/FollowCard';
import AuthService from '../services/auth.service';

import '../css/FollowListPage.css';

const FollowListPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const isFollowers = location.pathname === '/followers';
  
    useEffect(() => {
      const getCurrentUser = async () => {
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
            throw new Error('Erreur lors de la vérification de connexion');
          }
  
          const userData = await verifyLoginResponse.json();
          setCurrentUserId(userData.userId);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
      };
  
      getCurrentUser();
    }, []);
  
    useEffect(() => {
      if (currentUserId) {
        fetchUsers();
      }
    }, [isFollowers, currentUserId]);
  
    const fetchUsers = async () => {
      try {
        const route = isFollowers ? '/followers' : '/follows';
        const response = await fetch(`${API_URL}${route}/user/${currentUserId}`, {
          headers: {
            "Authorization": `Bearer ${AuthService.getToken()}`
          },
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = (await response.json()).data;
  
        // Récupérer les informations détaillées des utilisateurs
        const userPromises = data.map(async (item) => {
          const userId = isFollowers ? item.followerId : item.followedUserId;
          const userResponse = await fetch(`${API_URL}/users/${userId}`, {
            headers: {
              "Authorization": `Bearer ${AuthService.getToken()}`
            },
            credentials: "include",
          });
          
          if (!userResponse.ok) {
            throw new Error(`Erreur lors de la récupération de l'utilisateur ${userId}`);
          }
          return (await userResponse.json()).data;
        });
  
        const userDetails = await Promise.all(userPromises);
        setUsers(userDetails);
        setCount(userDetails.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };
  
    const handleFollowChange = () => {
      fetchUsers(); // Rafraîchir la liste après un changement de suivi
    };
  
    // Si l'ID de l'utilisateur n'est pas encore chargé, on peut afficher un loader
    if (!currentUserId) {
        //TODO : intégrer loader
      return <div>Chargement...</div>;
    }
  
    return (
      <div className="follow-main-container">
        <BackButton className="follow-back-button"/>
        <header>
          <h1 className="follow-page-title">
            {isFollowers ? 'Followers' : 'Suivi(e)s'}
          </h1>
          <p className="follow-page-subhead">
            {isFollowers 
              ? `${count} personne${count > 1 ? 's' : ''} vous suivent`
              : `Vous suivez ${count} personne${count > 1 ? 's' : ''}`}
          </p>
        </header>
        <main>
          {users.map(user => (
            <FollowCard
              key={user._id}
              user={user}
              currentUserId={currentUserId}
              onFollowChange={handleFollowChange}
            />
          ))}
        </main>
      </div>
    );
  };
  
  export default FollowListPage;