import React, { useState } from 'react';
import '../css/ProfilTabulation.css';
import Button from "./Button";
import Post from "./Post";
import ThumbnailPicture from './ThumbnailPicture';
import AnimalCard from './AnimalCard';

const ProfilTabulation = () => {
  const [activeTab, setActiveTab] = useState('publications');

  const tabs = [
    { id: 'publications', label: 'Mes publications' },
    { id: 'pictures', label: 'Mes photos' },
    { id: 'animals', label: 'Mes animaux' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'publications':
        return <div>
          <Post />
          <Post />
          <Post />
        </div>;
      case 'pictures':
        return <div>
          {/* Ici j'ai dû ajouter un div car className="tab-thumbnail-grid" ne fonctionnait pas dans le div du return */}
          <div className="tab-thumbnail-grid">
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
            <ThumbnailPicture />
          </div>
        </div>;
      case 'animals':
        return <div>
          <div className="tab-animal-container">
            <h2 className="tab-animal-title">
              Mes animaux
            </h2>
            
            <AnimalCard />

            <Button
              className={"tab-add-animal-button"}
              label="Ajouter un animal"
              // onClick={() => navigate("/signup")}
            />
          </div>
        </div>;
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