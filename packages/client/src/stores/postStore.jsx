import { create } from "zustand";

const API_URL = import.meta.env.VITE_BASE_URL;

const usePostStore = create((set) => ({
  posts: [],
  
  setPosts: (posts) => set({ posts }),

  addPost: async (newPost) => {
    set((state) => ({ posts: [newPost, ...state.posts] }));
    await usePostStore.getState().fetchPosts();
  },

  updatePost: async (postId, updater) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId ? { ...post, ...updater(post) } : post
      ),
    }));
    await usePostStore.getState().fetchPosts();
  },

  deletePost: async (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    }));
    await usePostStore.getState().fetchPosts();
  },

  fetchPosts: async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const posts = await response.json();
      set({ posts: posts.data }); // Assuming posts are in `data` field
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  },
}));

export default usePostStore;
