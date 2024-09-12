import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import Button from "./Button";
import SettingsButton from "./SettingsButton";
import Profil_image from "../assets/Profil_image_2.png"

import '../css/ProfilBio.css';

const ProfilBio = () => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState({
        firstName: 'Jane',
        lastName: 'Doe'
    });

    return (
        <>
            <div className="bio-main-container">
                <SettingsButton className="bio-settings-button"/>
                
                <div className="bio-infos">
                    <div className="bio-profil-picture-container">
                        <img src={Profil_image} alt="Image de profil de " className="bio-profil-picture" />
                    </div>
                    <div className="bio-name-summary">
                        <p className="name-and-firstname">{user.firstName} {user.lastName}</p>
                        <p className="bio-summary">Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio</p>
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