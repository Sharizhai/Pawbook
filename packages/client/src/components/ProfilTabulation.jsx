import React, { useState, useEffect, useRef  } from "react";
import useAnimalStore from "../stores/animalStore";
import usePostStore from "../stores/postStore";

import ThumbnailPicture from "./ThumbnailPicture";
import AnimalPanel from "./AnimalPanel";
import AnimalCard from "./AnimalCard";
import PostCard from "./PostCard";
import Button from "./Button";

import "../css/ProfilTabulation.css";

const ProfilTabulation = ({ user, currentUserId, openPostPanel, urlUserId }) => {

  const [activeTab, setActiveTab] = useState("publications");

  const { posts, fetchUserPosts, hasMore } = usePostStore((state) => state);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const { animals, lastUpdate } = useAnimalStore(state => ({
    animals: state.animals,
    lastUpdate: state.lastUpdate
  }));
  const [isAnimalPanelOpen, setIsAnimalPanelOpen] = useState(false);
  const openAnimalPanel = () => setIsAnimalPanelOpen(true);
  const closeAnimalPanel = () => setIsAnimalPanelOpen(false);

  const tabs = currentUserId === user?._id ? [
    { id: "publications", label: "Mes publications" },
    // { id: "pictures", label: "Mes photos" },
    { id: "animals", label: "Mes animaux" }
  ] : [
    { id: "publications", label: "Ses publications" },
    // { id: "pictures", label: "Ses photos" },
    { id: "animals", label: "Ses animaux" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        const userIdToFetch = urlUserId && urlUserId !== user._id ? urlUserId : user._id;

        await fetchUserPosts(userIdToFetch, 1);
        await useAnimalStore.getState().fetchAnimalsByOwnerId(userIdToFetch);
      }
    };

    fetchData();
  }, [user?._id, lastUpdate, fetchUserPosts]);

  useEffect(() => {
    if (!isFetching || !hasMore) return;

    const userIdToFetch = urlUserId && urlUserId !== user._id ? urlUserId : user._id;

    fetchUserPosts(userIdToFetch, page).then(() => {
      setIsFetching(false);
    });
  }, [isFetching, page, hasMore, fetchUserPosts, user._id, urlUserId]);

  useEffect(() => {
    if (!loader.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setIsFetching(true);
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasMore]);

  // const handleDeletePicture = (postIndex, imageIndex) => {
  //   updatePost(postIndex, (post) => {
  //     const updatedImages = [...post.images];
  //     updatedImages.splice(imageIndex, 1);
  //     return { ...post, images: updatedImages };
  //   });
  // };

  const handleAnimalCreated = (newAnimal) => {
    useAnimalStore.getState().fetchAnimalsByOwnerId(newAnimal.ownerId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "publications":
        // S'il l'user n'a pas encore créé de publication on lui propose de le faire
        const hasNoPosts = !Array.isArray(posts) || posts.length === 0;
        if (hasNoPosts && currentUserId === user?._id) {
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
            {Array.isArray(posts) && posts.map((post, index) => (
              <PostCard 
                key={post._id ? `post-${post._id}` : `temp-post-${index}-${Date.now()}`} 
                post={{
                  ...post,
                  likes: post.likes || [],
                  comments: post.comments || [],
                  images: post.images || [],
                }} 
              />
            ))}
            <div
                ref={loader}
                style={{
                  height: isFetching ? "50px" : "0px",
                  backgroundColor: isFetching ? "#EEE7E2" : "transparent",
                }}
              >
                {isFetching && <p>Chargement...</p>}
              </div>
          </div>
          );
        }
      // case "pictures": {
      //   return (
      //     <div className="tab-thumbnail-grid">
      //       {posts.flatMap((post, postIndex) =>
      //         post.photoContent.map((imageUrl, imageIndex) => (
      //           <ThumbnailPicture
      //             key={`${postIndex}-${imageIndex}`}
      //             src={imageUrl}
      //             alt={`Post ${postIndex} - Image ${imageIndex}`}
      //             className="profile-thumbnail"
      //             onDelete={() => handleDeletePicture(postIndex, imageIndex)}
      //           />
      //         )))}
      //     </div>
      //   );
      // }
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