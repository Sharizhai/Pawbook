import Button from "../components/Button";
import ProfilBio from "../components/ProfilBio";
import ProfilTabulation from "../components/ProfilTabulation";

import '../css/ProfilPage.css';

const ProfilPage = () => {

    return (
        <>
            <div className="profil-page-container">
                <ProfilBio/>
                <ProfilTabulation />
            </div>      
        </>
    )

};

export default ProfilPage;