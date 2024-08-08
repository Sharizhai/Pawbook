import SettingsButton from "./SettingsButton";
import '../css/AnimalCard.css';
import Animal_profil_pic from "../assets/dog-4072161_640.jpg";

const AnimalCard = () => {
    return(
        <>
            <div className="animal-card-container">
                <SettingsButton className="animal-card-settings-button" />
                <div className="animal-card-photo-and-resume">
                    <div className="animal-card-profil-picture-container">
                        <img src={Animal_profil_pic} alt="Image de profil de " className="animal-card-profil-picture" />
                    </div>
                    <div className="animal-card-resume-container">
                        <h3 className="animal-card-name-label">Nom</h3>
                        <h4 className="animal-card-infos-label">Race, sexe, âge</h4>
                        <p className="animal-card-bio-text">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta.</p>
                    </div>
                </div>

                <button className="animal-card-like-button">
                    <span className="material-symbols-outlined">favorite</span>
                </button>
            </div>
        </>
    )
}

export default AnimalCard;