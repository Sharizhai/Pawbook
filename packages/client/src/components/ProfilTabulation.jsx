import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useAnimalStore from "../stores/animalStore";
import usePostStore from "../stores/postStore";

import authenticatedFetch from '../services/api.service';
import AuthService from '../services/auth.service';
import ThumbnailPicture from "./ThumbnailPicture";
import AnimalPanel from "./AnimalPanel";
import AnimalCard from "./AnimalCard";
import PostCard from "./PostCard";
import Button from "./Button";

import "../css/ProfilTabulation.css";

const ProfilTabulation = ({ user, currentUserId, openPostPanel }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const [activeTab, setActiveTab] = useState("publications");

  const { posts, setPosts, updatePost } = usePostStore(state => state);
  const { animals, lastUpdate, setAnimals } = useAnimalStore(state => ({
    animals: state.animals,
    lastUpdate: state.lastUpdate
  }));
  const [authorId, setAuthorId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAnimalPanelOpen, setIsAnimalPanelOpen] = useState(false);

  const openAnimalPanel = () => setIsAnimalPanelOpen(true);
  const closeAnimalPanel = () => setIsAnimalPanelOpen(false);

  const tabs = currentUserId === user?._id ? [
    { id: "publications", label: "Mes publications" },
    { id: "pictures", label: "Mes photos" },
    { id: "animals", label: "Mes animaux" }
  ] : [
    { id: "publications", label: "Ses publications" },
    { id: "pictures", label: "Ses photos" },
    { id: "animals", label: "Ses animaux" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        await usePostStore.getState().fetchUserPosts(user._id);
        await useAnimalStore.getState().fetchAnimalsByOwnerId(user._id);
      }
    };

    fetchData();
  }, [user?._id, lastUpdate]);

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //         try {
  //             const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
  //                 method: "GET",
  //                 headers: {
  //                     "Authorization": `Bearer ${AuthService.getToken()}`
  //                 },
  //                 credentials: "include",
  //             });

  //             if (!verifyLoginResponse.ok) {
  //                 console.error("Utilisateur non connecté")
  //                 return;
  //             }

  //             const verifyLoginData = await verifyLoginResponse.json();
  //             setCurrentUserId(verifyLoginData.data);

  //             const targetUserId = userId || verifyLoginData.data;
  //             setAuthorId(targetUserId);

  //             await useAnimalStore.getState().fetchAnimalsByOwnerId(targetUserId);

  //         } catch (error) {
  //             console.error("Erreur:", error);
  //             setError(error.message);
  //         } finally {
  //             setIsLoading(false);
  //         }
  //     };

  //     fetchUserData();
  // }, [userId, lastUpdate]);

  const handleDeletePicture = (postIndex, imageIndex) => {
    updatePost(postIndex, (post) => {
      const updatedImages = [...post.images];
      updatedImages.splice(imageIndex, 1);
      return { ...post, images: updatedImages };
    });
  };

  const handleAnimalCreated = (newAnimal) => {
    useAnimalStore.getState().fetchAnimalsByOwnerId(newAnimal.ownerId);
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const verifyLoginResponse = await authenticatedFetch(`${API_URL}/users/verifyLogin`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${AuthService.getToken()}`
  //         },
  //         credentials: "include",
  //       });

  //       if (!verifyLoginResponse.ok) {
  //         console.error("Utilisateur non connecté")
  //         return;
  //       }

  //       const verifyLoginData = await verifyLoginResponse.json();
  //       setCurrentUserId(verifyLoginData.data);

  //       // On utilise l'ID de l'URL ou l'Id de l'user connecté
  //       const targetUserId = userId || verifyLoginData.data;
  //       setAuthorId(targetUserId);

  //       await usePostStore.getState().fetchUserPosts(targetUserId);
  //       await useAnimalStore.getState().fetchAnimalsByOwnerId(targetUserId);

  //     } catch (error) {
  //       console.error("Erreur:", error);
  //       setError(error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [setPosts, API_URL, userId, setAnimals]);

  const renderContent = () => {
    switch (activeTab) {
      case "publications":
        // S'il l'user n'a pas encore créé de publication on lui propose de le faire
        if (!Array.isArray(posts) && currentUserId === user?._id || posts.length === 0 && currentUserId === user?._id) {
          return (
            <>
              <div className="first-post-button-container">
                <Button
                  className="first-post-button"
                  label="Créez votre première publication"
                  onClick={openPostPanel}
                />
              </div>
            </>
          )
        }
        else {
          return (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          );
        }
      case "pictures": {
        return (
          <div className="tab-thumbnail-grid">
            {posts.flatMap((post, postIndex) =>
              post.photoContent.map((imageUrl, imageIndex) => (
                <ThumbnailPicture
                  key={`${postIndex}-${imageIndex}`}
                  src={imageUrl}
                  alt={`Post ${postIndex} - Image ${imageIndex}`}
                  className="profile-thumbnail"
                  onDelete={() => handleDeletePicture(postIndex, imageIndex)}
                />
              )))}
          </div>
        );
      }
      case "animals": {
        return (
          <div className="tab-animal-container">
            {currentUserId === user?._id && (
              <Button
                className="tab-add-animal-button"
                label="Ajouter un animal"
                onClick={openAnimalPanel}
              />
            )}
            {animals.map((animal) => (
              <AnimalCard
                key={animal._id}
                animal={animal}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <div className="profile-tabs">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>

      {isAnimalPanelOpen && (
        <AnimalPanel
          onClose={closeAnimalPanel}
          onAnimalCreated={handleAnimalCreated}
        />
      )}
    </>
  );
};

export default ProfilTabulation;