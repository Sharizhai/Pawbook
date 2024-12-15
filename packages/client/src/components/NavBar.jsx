import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'animate.css';

import Button from './Button';
import FloatingMenu from './FloatingMenu';
import AuthService from '../services/auth.service';
import floatingMenusData from "../data/floatingMenusData.json"

import '../css/NavBar.css';

const NavBar = ({ openPostPanel }) => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    const navItems = [
        { icon: "home", path: "/newsfeed", label: "Accueil" },
        { icon: "search", label: "Recherche" },
        { icon: "add_circle", label: "Créer un post" },
        { icon: "notifications", label: "Notifications" },
        { icon: "account_circle", path: `/profile/${userId}`, label: "Profil" }
    ];

    const menuItems = floatingMenusData.burger.nav;

    useEffect(() => {
        const verifyUser = async () => {
          try {
            const verifyLoginResponse = await fetch(`${API_URL}/users/verifyLogin`, {
              method: "GET",
              credentials: "include",
            });
    
            if (!verifyLoginResponse.ok) return;
    
            const { data: userId } = await verifyLoginResponse.json();
            setUserId(userId);
    
          } catch (error) {
            console.error("Erreur lors de la vérification:", error);
          }
        };
    
        verifyUser();
      }, []);

    useEffect(() => {
        const matchingItem = navItems.find(item => {
            if (!item.path) return false;
            // Pour le profil, on vérifie si le chemin commence par /profile
            if (item.label === "Profil") {
                return location.pathname.startsWith("/profile");
            }
            return location.pathname.startsWith(item.path);
        });
        if (matchingItem) {
            setActiveItem(matchingItem.label);
        } else {
            setActiveItem(null);
        }
    }, [location.pathname, userId]);

    const handleLogoClick = async () => {
        try {
            const verifyAdminResponse = await fetch(`${API_URL}/users/verifyAdmin`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });
    
            if (verifyAdminResponse.ok) {
                const { data } = await verifyAdminResponse.json();
                if (data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/newsfeed');
                }
            } else {
                navigate('/newsfeed');
            }
        } catch (error) {
            console.error("Erreur lors de la vérification admin:", error);
            navigate('/newsfeed');
        }
    };

    const handleItemClick = (item) => {
        setActiveItem(item.label);
        if (item.icon === "add_circle") {
            openPostPanel();
        } else if (item.path) {
            if (item.label === "Profil" && !userId) {
                console.error("Id utilisateur non valide");
                return;
            }
            navigate(item.path);
        } else if (item.icon === "search" || item.icon === "notifications") {
            Swal.fire({
                title: "Fonctionnalité prochainement disponible.",
                background: "#DEB5A5",
                position: "top",
                showConfirmButton: false,
                icon: "info",
                color: "#001F31",
                toast: true,
                timer: 5000,
                showClass: {
                  popup: `animate__animated
                            animate__fadeInDown
                            animate__faster`
                },
                hideClass: {
                  popup: `animate__animated
                            animate__fadeOutUp
                            animate__faster`
                }
            });
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
                    await AuthService.logout();
                } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Erreur lors de la déconnexion. Veuillez réessayer',
                        background: "#DEB5A5",
                        position: "top",
                        showConfirmButton: false,
                        color: "#001F31",
                        timer: 5000,
                        toast: true,
                        showClass: {
                          popup: `animate__animated
                                      animate__fadeInDown
                                      animate__faster`
                        },
                        hideClass: {
                          popup: `animate__animated
                                      animate__fadeOutUp
                                      animate__faster`
                        }
                      });
                }
                break;
            default:
                console.log("Action not implemented:", action);
        }
        setIsFloatingMenuOpen(false);
    };

    return (
        <nav className="navbar-container">

            <div className="navbar-logo-container">
                <img src={`${LOGO}`} 
                     alt="Logo du site Pawbook" 
                     className="navbar-logo" 
                     onClick={handleLogoClick}/>
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
                    {menuItems.map((item, index) => (
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