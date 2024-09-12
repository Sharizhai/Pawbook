import Button from "../components/Button";
import ProfilBio from "../components/ProfilBio";
import ProfilTabulation from "../components/ProfilTabulation";

import '../css/ProfilPage.css';

const ProfilPage = ({ openPostPanel }) => {

    return (
        <>
            <div className="profil-page-container">
                <ProfilBio/>
                <ProfilTabulation openPostPanel={openPostPanel} />
            </div>      
        </>
    )

};

export default ProfilPage;