import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import PostCard from "../components/PostCard";
import usePostStore from "../stores/postStore";
import FloatingMenu from "../components/FloatingMenu";
import Button from "../components/Button";

import '../css/NewsfeedPage.css';

const NewsfeedPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();

    const { posts, setPosts, updatePost } = usePostStore(state => state);
    const fetchPosts = usePostStore(state => state.fetchPosts);

    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchPosts()
            .then(() => {
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors du chargement des posts:", err);
                // TODO : Add toast
                setIsLoading(false);
            });
    }, [fetchPosts]);

    const burgerMenuItems = [
        { "label": "Conditions Générales", "action": "openCGU", "className": "" },
        { "label": "Se déconnecter", "action": "disconnect", "className": "floating-menu-disconnect-button" }
    ];

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
                        // TODO : Add toast
                    }
                } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    // TODO : Add toast
                }
                console.log("Utilisateur déconnecté");
                break;
            default:
                console.log("Action not implemented:", action);
        }
        setIsFloatingMenuOpen(false);
    };

    return (
        <>
            <div className="newsfeed-page">
                <div className="newsfeed-top-container">
                    <div className="navbar-logo-container">
                        <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="navbar-logo" />
                        <h1 className="navbar-title">Pawbook</h1>
                    </div>
                    <div className="navbar-more-container">
                        <button className="navbar-more" onClick={handleFloatingMenuOpen}>
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
                </div>
                <main className="newsfeed-container">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </main>
            </div>
        </>
    )

};

export default NewsfeedPage;