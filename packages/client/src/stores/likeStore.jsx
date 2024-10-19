import { create } from "zustand";

const API_URL = import.meta.env.VITE_BASE_URL;

const useLikeStore = create((set) => ({
  likes: [],
  
  setLikes: (likes) => set({ likes }),

  addLike: async (newLike) => {
    set((state) => ({ likes: [newLike, ...state.likes] }));
    await useLikeStore.getState().fetchLikes();
  },

  removeLike: async (likeId) => {
    set((state) => ({
      likes: state.likes.filter((like) => like._id !== likeId),
    }));
    await useLikeStore.getState().fetchLikes();
  },

  fetchLikes: async () => {
    try {
      const response = await fetch(`${API_URL}/likes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const likes = await response.json();
      set({ likes: likes.data });
    } catch (error) {
      console.error("Failed to fetch likes", error);
    }
  },
}));

export default useLikeStore;