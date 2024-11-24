import { create } from "zustand";
const API_URL = import.meta.env.VITE_BASE_URL;

const usePostStore = create((set, get) => ({
  posts: [],
  
  setPosts: (posts) => set({ posts }),
  
  // Méthode pour ajouter un post
  addPost: async (newPost, isProfilePage = false, userId = null, urlUserId = null) => {
    set((state) => ({ posts: [newPost, ...state.posts] }));
    
    if (isProfilePage && userId) {
      const userIdToFetch = urlUserId && urlUserId !== userId ? urlUserId : userId;
      await get().fetchUserPosts(userIdToFetch);
    } else {
      await get().fetchPosts();
    }
  },
  
  //Méthode pour updater un post
  updatePost: async (updatedPost, isProfilePage = false, userId = null, urlUserId = null) => {
    set((state) => {
      let updatedPosts;
      
      if (isProfilePage && userId) {
        updatedPosts = state.posts
          .filter(post => post.authorId?._id === userId)
          .map(post => post._id === updatedPost._id ? updatedPost : post);
      } else {
        updatedPosts = state.posts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        );
      }
      
      return { posts: updatedPosts };
    });
    
    if (isProfilePage && userId) {
      const userIdToFetch = urlUserId && urlUserId !== userId ? urlUserId : userId;
      await get().fetchUserPosts(userIdToFetch);
    } else {
      await get().fetchPosts();
    }
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
  deletePost: async (postId, shouldRefetch = true) => {
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    }));

    if (shouldRefetch) {
      await get().fetchPosts();
    }
  },
  
  // Méthode pour récupérer les tous posts
  fetchPosts: async (page = 1, limit = 10) => {
    try {
        const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();

        set((state) => ({
            posts: page === 1 
                ? data.data.posts
                : [...state.posts, ...data.data.posts],
            hasMore: data.data.hasMore,
        }));
    } catch (error) {
        console.error("Failed to fetch posts", error);
        throw error;
    }
},

  // Méthode pour récupérer les tous posts d'un user à l'aide de son ID
  fetchUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_URL}/posts/user/${userId}?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des posts de l'utilisateur");
      }

      const data = await response.json();
      
      const postsWithAuthor = data.data.posts.map((post) => ({
        ...post,
        authorId: {
          ...post.authorId,
          _id: userId,
        },
    }));
    
    set((state) => ({
        posts: page === 1 ? postsWithAuthor : [...state.posts, ...postsWithAuthor],
        hasMore: data.data.hasMore,
    }));
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      throw error;
    }
  },
}));

export default usePostStore;