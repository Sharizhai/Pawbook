import {create} from "zustand";

const usePostStore = create((set) => ({
    posts: [],
    addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
    updatePost: (index, updater) => set((state) => ({
      posts: state.posts.map((post, i) =>
        i === index ? updater(post) : post
      )
    }))
  }));
  
  export default usePostStore;