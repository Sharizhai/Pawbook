import React, { useState } from 'react';
import usePostStore from '../stores/postStore';

import Button from "./Button";
import PostCard from "./PostCard";
import ThumbnailPicture from './ThumbnailPicture';
import AnimalCard from './AnimalCard';

import '../css/ProfilTabulation.css';

// import Post_image from "../assets/dog-3724261_640.jpg";
// import Post_image_2 from "../assets/dog-4072161_640.jpg";

const ProfilTabulation = () => {
  const { posts } = usePostStore(state => state);
  const [activeTab, setActiveTab] = useState('publications');
  // const [userPictures, setUserPictures] = useState([
  //   { src: Post_image, alt: "Description de l'image 1" },
  //   { src: Post_image_2, alt: "Description de l'image 2" }
  // ]);

  const tabs = [
    { id: 'publications', label: 'Mes publications' },
    { id: 'pictures', label: 'Mes photos' },
    { id: 'animals', label: 'Mes animaux' }
  ];

  const handleDeletePicture = (postIndex, imageIndex) => {
    updatePost(postIndex, (post) => {
      const updatedImages = [...post.images];
      updatedImages.splice(imageIndex, 1);
      return { ...post, images: updatedImages };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'publications':
        return (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        );
      case 'pictures':
        return (
          <div className="tab-thumbnail-grid">
            {posts.flatMap(post => post.images).map((imageUrl, index) => (
              <ThumbnailPicture
                key={index}
                src={imageUrl}
                alt={`Post ${index}`}
                className="profile-thumbnail"
                onDelete={() => handleDeletePicture(postIndex, imageIndex)}
              />
            ))}
          </div>
        );
      case 'animals':
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