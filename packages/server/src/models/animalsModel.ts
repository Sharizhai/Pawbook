import { Response } from "express";
import { Types, FilterQuery } from "mongoose";

import Animal from "../schemas/animals";
import User from "../schemas/users";
import { IAnimal } from "../types/IAnimal";

//CRUD to get all animals
export const getAllAnimals = async (response: Response): Promise<IAnimal[] | null> => {
    try {
        const animals = await Animal.find().select("authorId postId animalId").exec();

        return animals;
    } catch (error) {
        console.error(error);

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
            return null;
        }

        return animal;
    } catch (error: any) {
        console.error(error);

        return null;
    }
};

//CRUD to create a new comment
export const createAnimal = async (animal: Partial<IAnimal>, response: Response): Promise<IAnimal | null> => {
    try {
        const newAnimal = await Animal.create(animal);

        // Met à jour l'utilisateur pour ajouter l'ID du nouvel animal
        await User.findByIdAndUpdate(animal.ownerId, {
            $push: { animals: newAnimal._id } // Ajoute l'animal au tableau d'animaux de l'utilisateur
        });

        return newAnimal;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to delete an animal by its id
export const deleteAnimal = async (animalId: Types.ObjectId, ownerId: Types.ObjectId, response: Response): Promise<IAnimal | null> => {
    try {
        const deletedAnimal = await Animal.findOneAndDelete({ 
            _id: animalId, 
            ownerId: ownerId });

        if (!deletedAnimal) {

            return null;
        }

        await User.findByIdAndUpdate(deletedAnimal.ownerId, {
            $pull: { animals: deletedAnimal._id }
        });

        return deletedAnimal;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to update an animal by its id
export const updateAnimal = async (id: Types.ObjectId, ownerId: Types.ObjectId, animalData: Partial<IAnimal>, response: Response): Promise<IAnimal | null> => {
    try {
        const updatedAnimal = await Animal.findOneAndUpdate(
            { _id: id, ownerId },
            animalData,
            { new: true }
        ).exec();

        if (!updatedAnimal) {

            return null;
        }

        return updatedAnimal;
    } catch (error) {
        console.error(error);

        return null;
    }
};


//CRUD to get all animals by their owner ID
export const findAnimalsByOwnerId = async (ownerId: Types.ObjectId, response: Response): Promise<IAnimal[] | null> => {
    try {
        const user = await User.findById(ownerId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const animals = await Animal.find({ ownerId : ownerId })
        .populate({
            path: 'likes',
            populate: {
                path: 'authorId',
                select: '_id name firstName profilePicture'
            }
        }).exec();

        if (animals.length === 0) {
            return null;
        }

        return animals;
    } catch (error) {
        console.error("Erreur lors de la recherche des animaux par utilisateur :", error);

        return null;
    }
};

//CRUD to get animals by a criteria
export const findAnimalsByCriteria = async (criteria: FilterQuery<IAnimal>, response: Response): Promise<IAnimal[] | null> => {
    try {
        const animals = await Animal.find(criteria).exec();

        return animals;
    } catch (error: any) {
        console.error(error);

        return null;
    }
};