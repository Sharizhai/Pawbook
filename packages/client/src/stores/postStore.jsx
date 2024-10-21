import { create } from "zustand";
const API_URL = import.meta.env.VITE_BASE_URL;

const usePostStore = create((set, get) => ({
  posts: [],
  
  setPosts: (posts) => set({ posts }),
  
  // Méthode pour ajouter un post
  addPost: async (newPost) => {
    set((state) => ({ posts: [newPost, ...state.posts] }));
    await get().fetchPosts();
  },
  
  //Méthode pour updater un post
  updatePost: async (postId, updater) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId ? { ...post, ...updater(post) } : post
      ),
    }));
    await get().fetchPosts();
  },

  // Méthode pour mettre à jours les likes d'un post
  updatePostLikes: (postId, newLike, isAdding = true) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isAdding 
              ? [...post.likes, newLike]
              : post.likes.filter(like => like.authorId._id !== newLike.authorId._id)
          };
        }
        return post;
      }),
    }));
  },
  
  // Méthode pour delete un post
  deletePost: async (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    }));
    await get().fetchPosts();
  },
  
  // Méthode pour récupérer les posts
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
      set({ posts: posts.data });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  },
}));

export default usePostStore;