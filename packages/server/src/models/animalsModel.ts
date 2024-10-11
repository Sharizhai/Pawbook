import { Response } from "express";
import { Types, FilterQuery  } from "mongoose";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";

import { animalValidation } from "../validation/validation";

import Animal from "../schemas/animals";

import { IAnimal } from "../types/IAnimal";

//CRUD to get all animals
export const getAllAnimals = async (response: Response): Promise<IAnimal[] | null> => {
    try {
        const animals = await Animal.find().select("authorId postId animalId").exec();

        APIResponse(response, animals, "Liste de tous les animaux récupérée avec succès");
        return animals;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des animaux", 500);
        return null;
    }
};

//CRUD to get an animal from its id
export const findAnimalById = async (id: Types.ObjectId, response: Response): Promise<IAnimal | null> => {
    try {
        const animal = await Animal.findById(id).populate([
            {
                path: "ownerId",
                select: "name firstName email"
            }
        ]).exec();

        if (!animal) {
            APIResponse(response, null, "Animal non trouvé", 404);
            return null;
        }

        APIResponse(response, animal, "Animal trouvé");
        return animal;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche de l'animal", 500);
        return null;
    }
};

//CRUD to create a new comment
export const createAnimal = async (animal: Partial<IAnimal>, response: Response): Promise<IAnimal | null> => {
    try {
        // Validation des données de l'animal avec Zod
        animalValidation.parse(animal);

        const newAnimal = await Animal.create(animal);

        APIResponse(response, newAnimal, "Animal ajouté avec succès", 201);
        return newAnimal;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données de l'animal invalides", 400);
        } else {
        console.error(error);
        APIResponse(response, null, "Erreur lors de l'ajout de l'animal", 500);
        }
        return null;
    }
};

//CRUD to delete an animal by its id
export const deleteAnimal = async (id: Types.ObjectId, ownerId: Types.ObjectId, response: Response): Promise<IAnimal | null> => {
    try {
        const deletedAnimal = await Animal.findOneAndDelete({ _id: id, ownerId });

        if (!deletedAnimal) {
            APIResponse(response, null, "Animal non trouvé ou vous n'êtes pas autorisé à le supprimer", 404);
            return null;
        }

        APIResponse(response, deletedAnimal, "Animal supprimé avec succès");
        return deletedAnimal;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression de l'animal", 500);
        return null;
    }
};

//CRUD to update an animal by its id
export const updateAnimal = async (id: Types.ObjectId, ownerId: Types.ObjectId, animalData: Partial<IAnimal>, response: Response): Promise<IAnimal | null> => {
    try {
        // Validation des données de l'animal avec Zod
        animalValidation.parse(animalData);

        const updatedAnimal = await Animal.findOneAndUpdate(
            { _id: id, ownerId },
            animalData,
            { new: true }
        ).exec();

        if (!updatedAnimal) {
            APIResponse(response, null, "Animal non trouvé ou vous n'êtes pas autorisé à le modifier", 404);
            return null;
        }

        APIResponse(response, updatedAnimal, "Animal mis à jour avec succès");
        return updatedAnimal;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données de l'animal invalides", 400);
        } else {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'animal", 500);
        }
        return null;
    }
};


//CRUD to get all animals by their owner ID
export const findAnimalsByOwnerId = async (ownerId: Types.ObjectId, response: Response): Promise<IAnimal[] | null> => {
    try {
        const animals = await Animal.find({ ownerId }).exec();

        if (animals.length === 0) {
            APIResponse(response, null, "Aucun animal trouvé pour cet utilisateur", 404);
            return null;
        }
        APIResponse(response, animals, "Animaux trouvés pour cet utilisateur");
        return animals;
    } catch (error) {
        console.error("Erreur lors de la recherche des animaux par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des animaux de l'utilisateur", 500);
        return null;
    }
};

//CRUD to get animals by a criteria
export const findAnimalsByCriteria = async ( criteria: FilterQuery<IAnimal>, response: Response ): Promise<IAnimal[] | null> => {
    try {
        const animals = await Animal.find(criteria).exec();

        APIResponse(response, animals, "Animaux trouvés");
        return animals;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche des animaux", 500);
        return null;
    }
};