import { create } from "zustand";

const API_URL = import.meta.env.VITE_BASE_URL;

const useAnimalStore = create((set, get) => ({
    animals: [],
    isLoading: false,
    error: null,

    setAnimals: (animals) => set({ animals }),

    addAnimal: async (newAnimal) => {
        set((state) => ({ animals: [newAnimal, ...state.animals] }));
        await get().fetchAnimalsByOwnerId(newAnimal.ownerId);
    },

    updateAnimal: async (updatedAnimal, ownerId) => {
        try {
            set({ isLoading: true, error: null });
            set(state => ({
                animals: state.animals.map(animal =>
                    animal._id === updatedAnimal._id ? { ...animal, ...updatedAnimal } : animal
                ),
            }));

            await get().fetchAnimalsByOwnerId(ownerId);
        } catch (error) {
            set({ error: error.message });
            console.error("Error updating animal:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Méthode pour mettre à jours les likes d'un animal
    updateAnimalLikes: (animalId, newLike, isAdding = true) => {
        set((state) => ({
            animals: state.animals.map((animal) => {
                if (animal._id === animalId) {
                    return {
                        ...animal,
                        likes: isAdding
                            ? [...animal.likes, newLike]
                            : animal.likes.filter(like => like.authorId._id !== newLike.authorId._id)
                    };
                }
                return animal;
            }),
        }));
    },

    deleteAnimal: async (animalId, shouldRefetch = true) => {
        set((state) => ({
            animals: state.animals.filter((animal) => animal._id !== animalId),
        }));
        if (shouldRefetch) {
            await get().fetchAnimalsByOwnerId();
        }
    },

    fetchAnimalsByOwnerId: async (ownerId = null) => {
        try {
            const url = ownerId
                ? `${API_URL}/animals/user/${ownerId}`
                : `${API_URL}/animals`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des animaux");
            }

            const data = await response.json();
            set({ animals: data.data });
        } catch (error) {
            console.error("Failed to fetch animals:", error);
            throw error;
        }
    },
}));

export default useAnimalStore;