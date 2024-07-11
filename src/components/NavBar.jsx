import React, { useState, useEffect } from 'react';
// We use NavLink instead of Link to automatically add an active class when the link corresponds to the actual URL
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
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
    if (item.path) {
      navigate(item.path);
    }
  };

  const isItemActive = (item) => {
    return activeItem === item.label;
  };

  return (
    <nav className="navbar-container">
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
    </nav>
  );
};

export default NavBar;