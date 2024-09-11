import React from "react";
import PostCard from "../components/PostCard";
import usePostStore from "../stores/postStore";

import '../css/NewsfeedPage.css';

const NewsfeedPage = () => {
    const posts = usePostStore(state => state.posts)

    return (
        <>
            <div className="newsfeed-page">
                <div className="newsfeed-top-container">
                    <div className="navbar-logo-container">
                        <img src="Logo_Pawbook.png" alt="Logo du site Pawbook" className="navbar-logo" />
                        <h1 className="navbar-title">Pawbook</h1>
                    </div>
                    <div className="navbar-more-container">
                        <button className="navbar-more" onClick={() => navigate("/gcu")}>
                            <span className="material-symbols-outlined icon">menu</span>
                            <span className="navbar-item-label">Plus</span>
                        </button>
                    </div>
                </div>
                <main className="newsfeed-container">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </main>
            </div>
        </>
    )

};

export default NewsfeedPage;