import React, { useState, useEffect } from 'react';
// We use NavLink instead of Link to automatically add an active class when the link corresponds to the actual URL
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from './Button';
import FloatingMenu from './FloatingMenu';

import '../css/NavBar.css';

const NavBar = ({ openPostPanel }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const navItems = [
        { icon: "home", path: "/newsfeed", label: "Accueil" },
        { icon: "search", label: "Recherche" },
        { icon: "add_circle", label: "Créer un post" },
        { icon: "notifications", label: "Notifications" },
        { icon: "account_circle", path: "/profile", label: "Profil" }
    ];

    const burgerMenuItems = [
        { "label": "Conditions Générales", "action": "openCGU", "className": "" },
        { "label": "Se déconnecter", "action": "disconnect", "className": "floating-menu-warning-button" }
    ];

    useEffect(() => {
        const matchingItem = navItems.find(item => item.path && location.pathname.startsWith(item.path));
        if (matchingItem) {
            setActiveItem(matchingItem.label);
        } else {
            setActiveItem(null);
        }
    }, [location.pathname]);

    const handleItemClick = (item) => {
        setActiveItem(item.label);
        if (item.icon === "add_circle") {
            openPostPanel();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const isItemActive = (item) => {
        return activeItem === item.label;
    };

    const handleFloatingMenuOpen = () => {
        setIsFloatingMenuOpen(true);
    };

    const handleFloatingMenuClose = () => {
        setIsFloatingMenuOpen(false);
    };

    const handleBurgerItemClick = async (action) => {
        switch (action) {
            case "openCGU":
                navigate("/gcu");
                break;
            case "disconnect":
                try {
                    const response = await fetch(`${API_URL}/users/logout`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
        
                    if (response.ok) {
                        navigate("/login");
                    } else {
                        console.error("La déconnexion a échoué")
                    }
                } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    setError("Une erreur s'est produite lors de la déconnexion. Veuillez réessayer.");
                }
                console.log("Utilisateur déconnecté");
                break;
            default:
                console.log("Action not implemented:", action);
        }
        setIsFloatingMenuOpen(false);
    };

    return (
        <nav className="navbar-container">

            <div className="navbar-logo-container">
                <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="navbar-logo" />
                <h1 className="navbar-title">Pawbook</h1>
            </div>

            <div className="navbar-items-container">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`navbar-item ${isItemActive(item) ? 'active' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <span className={`material-symbols-outlined icon ${isItemActive(item) ? 'filled' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="navbar-item-label">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="navbar-more-container">
                <button className="navbar-more"
                    onClick={handleFloatingMenuOpen}>
                    <span className="material-symbols-outlined icon">menu</span>
                    <span className="navbar-item-label">Plus</span>
                </button>
            </div>
            {isFloatingMenuOpen && (
                <FloatingMenu onClose={handleFloatingMenuClose}>
                    {burgerMenuItems.map((item, index) => (
                        <Button
                            key={index}
                            label={item.label}
                            onClick={() => handleBurgerItemClick(item.action)}
                            className={item.className}
                        />
                    ))}
                </FloatingMenu>
            )}
        </nav>
    );
};

export default NavBar;