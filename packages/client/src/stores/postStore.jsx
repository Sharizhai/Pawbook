import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
  updatePost: (postId, updater) => set((state) => ({
    posts: state.posts.map((post) =>
      post._id === postId ? { ...post, ...updater(post) } : post
    )
  })),
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter((post) => post._id !== postId)
  }))
}));

export default usePostStore;