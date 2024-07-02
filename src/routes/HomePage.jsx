import '../css/global.css';
import '../css/HomePage.css';

import Button from '../components/Button';

const HomePage = () => {

    return (
        <>
            <main className="home-main-container">
                <header className="home-header-container">
                    <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="logo" />
                    <h1 className="website-name logo-title">Pawbook</h1>
                    <p className="home-subheading">Le premier réseau social pour les amoureux des animaux</p>
                </header>

                <nav className="home-buttons-container">
                    <Button
                        label="Se connecter"
                        onClick={() => console.log('Je me connecte')}
                    />

                    <Button
                        label="Créer un compte"
                        onClick={() => console.log('Je me cée un compte')}
                    />
                </nav>
            </main>

            <footer className="footer-container">
                <a href="/gcu">Conditions Générales d'Utilisation</a>
                <p>&copy; 2024 Pawbook</p>
            </footer>
        </>
    )
};

export default HomePage;