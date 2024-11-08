import { create } from "zustand";

const API_URL = import.meta.env.VITE_BASE_URL;

const usePhotoStore = create((set) => ({
  uploadedPhotos: [],
  isUploading: false,
  error: null,

  uploadPhotos: async (files) => {
    try {
      set({ isUploading: true, error: null });
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch(`${API_URL}/photos/upload/multiple`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      set({ 
        uploadedPhotos: data.data.filenames,
        error: null 
      });
      
      return data.data.filenames;
    } catch (error) {
      console.error('Error uploading photos:', error);
      set({ error: 'Failed to upload photos' });
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },

  clearUploadedPhotos: () => {
    set({ uploadedPhotos: [], error: null });
  },
}));

export default usePhotoStore;