import {create} from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
}));

export default usePostStore;