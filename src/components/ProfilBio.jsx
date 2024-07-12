import Button from "./Button";

import '../css/ProfilBio.css';

const ProfilBio = () => {

    return (
        <>
            <div className="bio-main-container">

                <div className="bio-infos">
                    <div className="bio-profil-picture-container">
                        <img src="" alt="Image de profil de " className="bio-profil-picture"/>
                    </div>
                    <div className="bio-name-summary">

                    </div>
                </div>

                <div className="bio-buttons-container">
                    <Button
                        className="bio-followers-button"
                        label="Followers"
                        onClick={() => navigate("/followers")}
                    />

                    <Button
                        className="bio-follows-button"
                        label="Suivi(e)s"
                        onClick={() => navigate("/follows")}
                    />
                </div>

            </div>
        </>
    )

};

export default ProfilBio;