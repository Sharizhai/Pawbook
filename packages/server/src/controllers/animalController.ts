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
            logger.warn("Erreurs de validation Zod :", error.errors);
            const validationErrors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
            return APIResponse(
                response,
                validationErrors,
                "Erreur(s) de validation",
                400
            );
        } else {
            logger.error("Erreur lors de la création de l'animal: " + error.message);
            APIResponse(response, null, "Erreur lors de la création de l'animal", 500);
        }
    }
};

// Controller to delete an animal by its ID
export const deleteAnimalById = async (request: Request, response: Response) => {
    try {
        const animalId = new Types.ObjectId(request.params.animalId);
        const ownerId = new Types.ObjectId(request.params.ownerId);

        logger.info(`[DELETE] /animals/${animalId}/${ownerId}- Suppression d'un animal par l'utilisateur`);

        const deletedAnimal = await Model.animals.delete(animalId, ownerId, response);
        
        if (!deletedAnimal) {
            return APIResponse(response, null, "Animal non trouvé ou non autorisé", 404);
        }

        logger.info("Animal supprimé avec succès");
        return APIResponse(response, "Animal supprimé avec succès", "success", 200);
    } catch (error : any){
        logger.error("Erreur lors de la suppression de l'animal", error.message);
        APIResponse(response, null, "Erreur lors de la suppression de l'animal", 500);
    }
};

// Controller to update an animal
export const updateAnimal = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        logger.info(`[PUT] /animals/${id} - Mise à jour de l'animal`);
        const animal = request.body;

        const updatedAnimal = await Model.animals.update(new Types.ObjectId(id),  animal, response);

        logger.info("Animal mis à jour");
        return APIResponse(response, updatedAnimal, "Animal mis à jour avec succès", 200);
    } catch (error: any){
        logger.error("Erreur lors de la mise à jour de l'animal :", error.message);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'animal", 500);
    }
};

// Controller to retrieve animals from a specific user
export const getAnimalsByOwnerId = async (request: Request, response: Response) => {
    try {
        const { ownerId } = request.params;
        logger.info(`[GET] /animals/user/${ownerId} - Récupération des animaux via leur ownerId: ${ownerId}`);

        if (!ownerId || ownerId === 'undefined') {
            logger.warn("ID du propriétaire manquant ou invalide");
            return APIResponse(response, null, "ID du propriétaire manquant ou invalide", 400);
        }

        if (!Types.ObjectId.isValid(ownerId)) {
            logger.warn("ID du propriétaire invalide");
            return APIResponse(response, null, "ID du propriétaire invalide", 400);
        }

        const objectIdUserId = new Types.ObjectId(ownerId);
        logger.info("ID du propriétaire transformé en ObjectId: " + objectIdUserId);

        const animalsResponse  = await Model.animals.findByOwner(new Types.ObjectId(ownerId), response);

        if (!animalsResponse  || animalsResponse .length === 0) {
            logger.warn("Aucun animal trouvé pour cet utilisateur");
            return APIResponse(response, [], "Aucun animal trouvé pour cet utilisateur", 200);
        }

        logger.info("Animaux récupérés avec succès");
        return APIResponse(response, animalsResponse , "Animaux récupérés avec succès", 200);
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