import React from "react";
import PostCard from "../components/PostCard";
import usePostStore from "../stores/postStore";

import '../css/NewsfeedPage.css';

const NewsfeedPage = () => {
    const posts = usePostStore(state => state.posts)

    return (
        <>
            <main className="newsfeed-container">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </main>
        </>
    )

};

export default NewsfeedPage;