import React from "react";
import PostCard from "../components/PostCard";
import usePostStore from "../stores/postStore";

const NewsfeedPage = () => {
    const posts = usePostStore(state => state.posts)

    return (
        <>
            {posts.map((post) => (
            <PostCard key={post.id} post={post} />
            ))}
        </>
    )

};

export default NewsfeedPage;