import Animal_profil_pic from "../assets/dog-4072161_640.jpg";
import SettingsButton from "./SettingsButton";

import '../css/AnimalCard.css';

const AnimalCard = ({ animal }) => {
    return (
        <div className="animal-card-container">
            <SettingsButton className="animal-card-settings-button" />
            <div className="animal-card-photo-and-resume">
                <div className="animal-card-profil-picture-container">
                    <img
                        src={animal.picture || Animal_profil_pic}
                        alt={`Image de ${animal.name}`}
                        className="animal-card-profil-picture"
                    />
                </div>
                <div className="animal-card-resume-container">
                    <h3 className="animal-card-name-label">{animal.name}</h3>
                    <h4 className="animal-card-infos-label">
                        {`${animal.race}, ${animal.type}${animal.age ? `, ${animal.age} ans` : ''}`}
                    </h4>
                    <p className="animal-card-bio-text">{animal.description}</p>
                </div>
            </div>
            <button className="animal-card-like-button">
                <span className="material-symbols-outlined">favorite</span>
            </button>
        </div>
    );
};

export default AnimalCard;