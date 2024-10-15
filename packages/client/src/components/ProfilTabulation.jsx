import React, { useState, useEffect } from "react";
import usePostStore from "../stores/postStore";

import Button from "./Button";
import PostCard from "./PostCard";
import ThumbnailPicture from "./ThumbnailPicture";
import AnimalCard from "./AnimalCard";

import "../css/ProfilTabulation.css";

const ProfilTabulation = ({ openPostPanel }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const [activeTab, setActiveTab] = useState("publications");

  const { posts, setPosts, updatePost } = usePostStore(state => state);
  const [animals, setAnimals] = useState([]);
  const [authorId, setAuthorId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "publications", label: "Mes publications" },
    { id: "pictures", label: "Mes photos" },
    { id: "animals", label: "Mes animaux" }
  ];

  const handleDeletePicture = (postIndex, imageIndex) => {
    updatePost(postIndex, (post) => {
      const updatedImages = [...post.images];
      updatedImages.splice(imageIndex, 1);
      return { ...post, images: updatedImages };
    });
  };

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
        console.log("Réponse de verifyLogin:", await verifyLoginResponse.text());
      
          if (!verifyLoginResponse.ok) {
              console.error("Utilisateur non connecté")
              return;
          }

          const verifyLoginData = await verifyLoginResponse.json();
          const userId = verifyLoginData.data;

          setAuthorId(userId);
          console.log(userId)

          await fetchUserPosts(userId);
          //await fetchUserAnimals(authorId);

      } catch (error) {
          console.error("Erreur:", error);
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
  };

    const fetchUserPosts = async (userId) => {
      try {
        console.log("authorId dans fetchUserPosts", userId);
        const response = await fetch(`${API_URL}/posts/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const userPosts = await response.json();
          console.log("Posts récupérés :", userPosts); // Ajoutez ce log pour vérifier la réponse
          setPosts(Array.isArray(userPosts) ? userPosts : []);
          setPosts(userPosts.data);
        } else {
          console.error("Erreur lors de la récupération des posts");
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
  
    // const fetchUserAnimals = async (authorId) => {
    //   try {
    //     console.log("authorId dans fetchUserAnimals", authorId);
    //     const response = await fetch(`${API_URL}/animals/user/${authorId}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //     });
    //     if (response.ok) {
    //       const userAnimals = await response.json();
    //       setAnimals(userAnimals);
    //     } else {
    //       console.error("Erreur lors de la récupération des animaux");
    //     }
    //   } catch (error) {
    //     console.error("Erreur:", error);
    //   }
    // };

    fetchUserData();
  }, [setPosts, API_URL]);

  const renderContent = () => {
    switch (activeTab) {
      case "publications":
        // S'il l'user n'a pas encore créé de publication on lui propose de le faire
        if (!Array.isArray(posts) || posts.length === 0) {
          return (
            <>
              <div className="first-post-button-container">
                <Button
                  className="first-post-button"
                  label="Créez votre première publication"
                  onClick={() => openPostPanel()}
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
      case "pictures":
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
      case "animals":
        return (
          <div className="tab-animal-container">
            <h2 className="tab-animal-title">
              Mes animaux
            </h2>
            <AnimalCard />
            <Button
              className="tab-add-animal-button"
              label="Ajouter un animal"
            // onClick={() => navigate("/signup")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
  );
};

export default ProfilTabulation;