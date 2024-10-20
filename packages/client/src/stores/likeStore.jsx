import { create } from "zustand";
import AuthService from '../services/auth.service';

const API_URL = import.meta.env.VITE_BASE_URL;

const useLikeStore = create((set, get) => ({
  currentUserId: null,
  likes: [],

  getCurrentUserId: async () => {
    try {
      const response = await fetch(`${API_URL}/users/verifyLogin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthService.getToken()}`
        },
        credentials: "include",
      });
      if (!response.ok) return null;
      const data = await response.json();
      set({ currentUserId: data.data });
      return data.data;
    } catch (error) {
      console.error("Erreur lors de la vérification du login:", error);
      return null;
    }
  },

  fetchLikesForPost: async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        headers: {
          "Authorization": `Bearer ${AuthService.getToken()}`
        },
        credentials: "include",
      });
      if (!response.ok) return;

      const post = await response.json();
      set((state) => ({ likes: [...state.likes, ...post.likes] }));
    } catch (error) {
      console.error("Erreur lors de la récupération des likes:", error);
    }
  },

  addLike: async ({ postId }) => {
    try {
      const currentUserId = await get().getCurrentUserId();
      if (!currentUserId) return false;

      const response = await fetch(`${API_URL}/likes/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthService.getToken()}`
        },
        credentials: "include",
        body: JSON.stringify({ 
          postId, 
          authorId: currentUserId 
        })
      });

      const data = await response.json();
      if (data.message === "Like créé avec succès") {
        set((state) => ({ likes: [...state.likes, { postId, authorId: currentUserId }] })); // Ajouter le like localement
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'ajout du like:", error);
      return false;
    }
  },

  removeLike: async (postId) => {
    try {
      const currentUserId = await get().getCurrentUserId();
      if (!currentUserId) return false;

      // Récupérer le like à supprimer en fonction du postId et authorId
      const likeToRemove = get().likes.find(like => like.postId === postId && like.authorId === currentUserId);
      if (!likeToRemove) {
        console.log('Aucun like trouvé pour ce post.');
        return false;
      }

      const response = await fetch(`${API_URL}/likes/${likeToRemove._id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthService.getToken()}`
        },
        credentials: "include",
      });

      if (response.ok) {
        set((state) => ({ likes: state.likes.filter(like => like._id !== likeToRemove._id) }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression du like:", error);
      return false;
    }
  },

  isLiked: async (postId) => {
    try {
      const currentUserId = await get().getCurrentUserId();
      if (!currentUserId) return false;

      const postLikes = get().likes.filter(like => like.postId === postId);
      return postLikes.some(like => like.authorId === currentUserId);
    } catch {
      return false;
    }
  }
}));

export default useLikeStore;