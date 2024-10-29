import { Request, Response } from "express";
import { Types, FilterQuery } from "mongoose";
import  { z } from "zod";

import { APIResponse, logger } from "../utils";
import { animalValidation } from "../validation/validation";
import Model from "../models/index";

// Controller to retrieve all the animals
export const getAnimals = async (request: Request, response: Response) => {
    try {
        const animals = await Model.animals.get(response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des animaux", 500);
    }
};

// Controller to retrieve an animal by its ID
export const getAnimalById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const animal = await Model.animals.where(id, response);

        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du animal :", error);
        APIResponse(response, null, "Erreur lors de la recherche du animal", 500);
    }
};

// Controller to create a new like
export const createAnAnimal = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /animals/register - Création d'un nouvel animal");
        const animalData = request.body;

        const validatedData = animalValidation.parse(animalData);

        const newAnimalData = {
            ownerId: new Types.ObjectId(validatedData.ownerId),
            name: validatedData.name,
            picture: validatedData.picture,
            type: validatedData.type,
            race: validatedData.race,
            age: validatedData.age,
            description: validatedData.description,
        };

        const newAnimal= await Model.animals.create(newAnimalData, response);
        logger.info("Nouvel animal créé avec succès");
        APIResponse(response, newAnimal, "Animal créé avec succès", 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            logger.error("Données invalides : " + error.errors.map(e => e.message).join(", "));
            APIResponse(response, null, "Données invalides : " + error.errors.map(e => e.message).join(", "), 400);
        } else {
            logger.error("Erreur lors de la création de l'animal: " + error.message);
            APIResponse(response, null, "Erreur lors de la création de l'animal", 500);
        }
    }
};

// Controller to delete an animal by its ID
export const deleteAnimalById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const ownerId = request.params.ownerId;

        await Model.animals.delete(new Types.ObjectId(id), new Types.ObjectId(ownerId), response);

        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error){
            console.error("Erreur lors de la suppression de l'animal :", error);
            APIResponse(response, null, "Erreur lors de la suppression de l'animal", 500);
    }
};

// Controller to update an animal
export const updateAnimal = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const ownerId = request.params.ownerId;
        const animal = request.body;

        await Model.animals.update(new Types.ObjectId(id), new Types.ObjectId(ownerId),  animal, response);

        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error){
            console.error("Erreur lors de la mise à jour de l'animal :", error);
            APIResponse(response, null, "Erreur lors de la mise à jour de l'animal", 500);
    }
};

// Controller to retrieve animals from a specific user
export const getAnimalsByOwnerId = async (request: Request, response: Response) => {
    try {
        const ownerId = new Types.ObjectId(request.params.ownerId);
        const animals = await Model.animals.findByOwner(ownerId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux de l'utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la récupération des animaux de l'utilisateur", 500);
    }
};

//TODO : 
// Refacto this method
// Controller to retrieve animals from a specific criteria
export const getAnimalsByCriteria = async (request: Request, response: Response) => {
    try {
        const criteria = new Types.ObjectId(request.params.ownerId);
        const animals = await Model.animals.findByCriteria(criteria, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux de l'utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la récupération des animaux de l'utilisateur", 500);
    }
};

export const getAnimalByMe = async (request: Request, response: Response) => {
    try {
        const id = response.locals.user.id;
        await Model.animals.findByOwner(id, response);

        APIResponse(response, id, "", 200);
    } catch (error: unknown) {
        console.error("Erreur lors de la récupération de l'id pour le profil :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
}