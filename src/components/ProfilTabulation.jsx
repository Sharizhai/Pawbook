import React, { useState } from 'react';
import '../css/ProfilTabulation.css';
import Button from "./Button";
import PostCard from "./PostCard";
import ThumbnailPicture from './ThumbnailPicture';
import AnimalCard from './AnimalCard';
import usePostStore from '../stores/postStore';

const ProfilTabulation = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const [userPictures, setUserPictures] = useState([
    { src: Post_image, alt: "Description de l'image 1" },
    { src: Post_image_2, alt: "Description de l'image 2" }
  ]);
  const posts = usePostStore(state => state.posts);

  const tabs = [
    { id: 'publications', label: 'Mes publications' },
    { id: 'pictures', label: 'Mes photos' },
    { id: 'animals', label: 'Mes animaux' }
  ];

  const handleDeletePicture = (index) => {
    setUserPictures(prevPictures => prevPictures.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'publications':
        return <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
            ))}
        </div>;
      case 'pictures':
        return (
          <div className="tab-thumbnail-grid">
            {userPictures.map((picture, index) => (
              <ThumbnailPicture
                key={index}
                src={picture.src}
                alt={picture.alt}
                className="profile-thumbnail"
                onDelete={() => handleDeletePicture(index)}
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