import React, { useState } from 'react';
import '../css/ProfilTabulation.css';
import Post from "./Post";
import ThumbnailPicture from './ThumbnailPicture';

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
        return <div>Contenu des animaux</div>;
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