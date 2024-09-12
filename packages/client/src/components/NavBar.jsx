import React, { useState, useEffect } from 'react';
// We use NavLink instead of Link to automatically add an active class when the link corresponds to the actual URL
import { useLocation, useNavigate } from 'react-router-dom';

import '../css/NavBar.css';

const NavBar = ({openPostPanel}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const navItems = [
        { icon: "home", path: "/newsfeed", label: "Accueil" },
        { icon: "search", label: "Recherche" },
        { icon: "add_circle", label: "Créer un post" },
        { icon: "notifications", label: "Notifications" },
        { icon: "account_circle", path: "/profile/:id", label: "Profil" }
    ];

    // We use useEffect to reinitialize activeItem when URL changes
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
                        onClick={() => navigate("/gcu")}>
                    <span className="material-symbols-outlined icon">menu</span>
                    <span className="navbar-item-label">Plus</span>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;