import { useLocation } from 'react-router-dom';

import BackButton from '../components/BackButton';
import FollowCard from '../components/FollowCard';

import '../css/FollowListPage.css';

const FollowListPage = () => {
    const location = useLocation();

    //Je détermine le titre de la page selon la route
    const pageTitle = location.pathname === '/followers' ? 'Followers' : 'Suivi(e)s';
    //Booléen pour afficher le bon sous-titre
    const isFollowers = location.pathname === '/followers';

    //TODO: 
    //Récpérer le nombre de followers/follows pour l'afficher dans le sous-titre
    //X personnes vous suivent / Vous suivez X personnes

    return (
        <>
            <div className="follow-main-container">
                <BackButton />

            <header>
                <h1 className="follow-page-title">{pageTitle}</h1>

                {isFollowers ? (
                    <p className="follow-page-subhead">Les personnes qui vous suivent</p>
                ) : (
                    <p className="follow-page-subhead">Les personnes que vous suivez</p>
                )}
            </header>

            <main>
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
                <FollowCard />
            </main>
            </div>
        </>
    )

};

export default FollowListPage;