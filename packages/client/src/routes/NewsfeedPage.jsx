import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef  } from "react";

import PostCard from "../components/PostCard";
import usePostStore from "../stores/postStore";
import FloatingMenu from "../components/FloatingMenu";
import Button from "../components/Button";

import '../css/NewsfeedPage.css';

const NewsfeedPage = () => {
    const API_URL = import.meta.env.VITE_BASE_URL;
    const LOGO = import.meta.env.VITE_LOGO_URL;

    const navigate = useNavigate();

    const { posts, fetchPosts, hasMore  } = usePostStore(state => state);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    const loader = useRef(null);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    useEffect(() => {
        if (!isFetching || !hasMore) 
            return;

        fetchPosts(page).then(() => {
            setIsFetching(false);
        });
    }, [isFetching, page, fetchPosts, hasMore]);

    useEffect(() => {
        if (!loader.current) 
            return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore) {
                    setIsFetching(true);
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loader.current);
        return () => observer.disconnect();
    }, [loader, hasMore]);

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
                        <img src={`${LOGO}`} alt="Logo du site Pawbook" className="navbar-logo" />
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
                    {posts.map((post, index) => (
                        <PostCard key={post._id || `temp-post-${index}-${Date.now()}`} post={post} />
                    ))}
                    <div
                        ref={loader}
                        style={{
                            height: isFetching ? "50px" : "0px",
                            backgroundColor: isFetching ? "#EEE7E2" : "transparent",
                        }}
                    >
                        {isFetching && <p>Chargement...</p>}
                    </div>
                </main>
            </div>
        </>
    )

};

export default NewsfeedPage;