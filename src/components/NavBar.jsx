import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import "../css/NavBar.css";

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);

    const navItems = [
        {icon : "home", path: "/", label: "Accueil"},
        {icon : "search", label: "Recherche"},
        {icon : "add_circle", label: "Créer un post"},
        {icon : "notifications", label: "Notifications"},
        {icon : "account_circle", path: "/profile/:id", label: "Profil"}
    ];

    return (
        <>
            <nav>
                {navItems.map((item, index) =>(
                    <Link key = {index} to={item.path}>
                         <span className="material-symbols-outlined icon">{item.icon}</span>
                    </Link>
                ))}
            </nav>
        </>
    )
};

export default NavBar;