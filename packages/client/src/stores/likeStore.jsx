import { create } from 'zustand';
import AuthService from '../services/auth.service';
import useAnimalStore from './animalStore';
import usePostStore from './postStore';

const API_URL = import.meta.env.VITE_BASE_URL;

const useLikeStore = create((set, get) => ({
  likedPosts: new Set(),
  likedAnimals: new Set(),

  // Méthode pour vérifier les likes d'un user sur un post
  checkUserLike: (post, currentUserId) => {
    if (!post || !post.likes) return false;
    
    return post.likes.some(like => like.authorId._id === currentUserId);
  },

  // Méthode pour vérifier les likes d'un user sur un animal
  checkUserAnimalLike: (animal, currentUserId) => {
    if (!animal || !animal.likes) return false;
    
    return animal.likes.some(like => like.authorId._id === currentUserId);
  },

  // Méthode pour ajouter un like à un post
  addLike: async (post, currentUserId) => {
    try {
      const response = await fetch(`${API_URL}/likes/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorId: currentUserId,
          postId: post._id
        }),
        credentials: "include"
      });

      if (response.ok) {
        const likeData = await response.json();
        const newLike = {
          _id: likeData.data._id,
          authorId: {
            _id: currentUserId,
          },
          postId: post._id,
          createdAt: new Date().toISOString()
        };

        // On met à jour le state local
        set(state => {
          const newLikedPosts = new Set(state.likedPosts);
          newLikedPosts.add(post._id);
          return { likedPosts: newLikedPosts };
        });

        // Pn met à jour le post dans le postStore
        usePostStore.getState().updatePostLikes(post._id, newLike, true);

        return newLike;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de l'ajout du like:", error);
      throw error;
    }
  },

  // Méthode pour ajouter un like à un animal
  addAnimalLike: async (animal, currentUserId) => {
    try {
      const response = await fetch(`${API_URL}/likes/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorId: currentUserId,
          animalId: animal._id
        }),
        credentials: "include"
      });

      if (response.ok) {
        const likeData = await response.json();
        const newLike = {
          _id: likeData.data._id,
          authorId: {
            _id: currentUserId,
          },
          animalId: animal._id,
          createdAt: new Date().toISOString()
        };

        // On met à jour le state local
        set(state => {
          const newLikedAnimals = new Set(state.likedAnimals);
          newLikedAnimals.add(animal._id);
          return { likedAnimals: newLikedAnimals };
        });

        // Pn met à jour le post dans l'animalStore
        useAnimalStore.getState().updateAnimalLikes(animal._id, newLike, true);

        return newLike;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de l'ajout du like:", error);
      throw error;
    }
  },

  //Méthode pour retirer un like d'un post
  removeLike: async (post, currentUserId) => {
    try {
      const response = await fetch(`${API_URL}/likes/post/${post._id}/${currentUserId}`, {
        method: 'DELETE',
        credentials: "include"
      });

      if (response.ok) {
        // Mettre à jour le state local
        set(state => {
          const newLikedPosts = new Set(state.likedPosts);
          newLikedPosts.delete(post._id);
          return { likedPosts: newLikedPosts };
        });

        // Pn met à jour le post dans le postStore
        usePostStore.getState().updatePostLikes(
          post._id, 
          { authorId: { _id: currentUserId } },
          false
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression du like:", error);
      throw error;
    }
  },

  //Méthode pour retirer un like d'un animal
  removeAnimalLike: async (animal, currentUserId) => {
    try {
      const response = await fetch(`${API_URL}/likes/animal/${animal._id}/${currentUserId}`, {
        method: 'DELETE',
        credentials: "include"
      });

      if (response.ok) {
        // Mettre à jour le state local
        set(state => {
          const newLikedAnimals = new Set(state.likedAnimals);
          newLikedAnimals.delete(animal._id);
          return { likedAnimals: newLikedAnimals };
        });

        // Pn met à jour le post dans l'animalStore
        useAnimalStore.getState().updateAnimalLikes(
          animal._id, 
          { authorId: { _id: currentUserId } },
          false
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression du like:", error);
      throw error;
    }
  },

  // Méthode pour initialiser les likes d'un post. 
  initializeLikes: (posts, currentUserId) => {
    const likedPostIds = new Set();
    posts.forEach(post => {
      if (post.likes.some(like => like.authorId._id === currentUserId)) {
        likedPostIds.add(post._id);
      }
    });
    set({ likedPosts: likedPostIds });
  },

  // Méthode pour initialiser les likes d'un animal. 
  initializeAnimalsLikes: (animals, currentUserId) => {
    const likedAnimalIds = new Set();
    animals.forEach(animal => {
      if (animal.likes.some(like => like.ownerId._id === currentUserId)) {
        likedAnimalIds.add(animal._id);
      }
    });
    set({ likedAnimals: likedAnimalIds });
  }
}));

export default useLikeStore;