import { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { APIResponse, logger } from "../utils";
import Model from "../models/index";
import { likeValidation } from "../validation/validation";

// Controller to retrieve all the likes
export const getLikes = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /likes - Récupération de tous les likes");
        const likes = await Model.likes.get(response);
        
        logger.info("Liste de tous les likes récupérée avec succès");
        APIResponse(response, likes, "Liste de tous les likes récupérée avec succès", 200);
    } catch (error : any) {
        logger.error("Erreur lors de la récupération des likes: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des likes", 500);
    }
};

// Controller to retrieve a like by its ID
export const getLikeById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /likes/${id} - Récupération du like via son ID`);

        const like = await Model.likes.where(id, response);

        if (like) {
            logger.info("Like récupéré avec succès");
            APIResponse(response, like, "Like récupéré avec succès", 200);
        } else {
            logger.info("Like non trouvé");
            APIResponse(response, null, "Like non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la récupération du like: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération du like", 500);
    }
};

// Controller to create a new like
export const createALike = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /likes/register - Création d'un nouveau like");
        const likeData = request.body;
        const validatedData = likeValidation.parse(likeData);

        const newLikeData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            postId: validatedData.postId ? new Types.ObjectId(validatedData.postId) : undefined,
            animalId: validatedData.animalId ?new Types.ObjectId(validatedData.animalId) : undefined,
        }

        const newLike = await Model.likes.create(newLikeData, response);

        logger.info("Nouveau like créé avec succès");
        return APIResponse(response, newLike, "Like créé avec succès", 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            logger.error("Données invalides : " + error.errors.map(e => e.message).join(", "));
            APIResponse(response, null, "Données invalides : " + error.errors.map(e => e.message).join(", "), 400);
        } else {
            logger.error("Erreur lors de la création du like: " + error.message);
            APIResponse(response, null, "Erreur lors de la création du like", 500);
        }
    }
};

// Controller to delete a like by its ID
export const deleteLikeById = async (request: Request, response: Response) => {
    try {
        console.log('Params reçus:', request.params);
        const postId = new Types.ObjectId(request.params.postId);
        const authorId = new Types.ObjectId(request.params.authorId);
        console.log('PostID converti:', postId);
        console.log('AuthorID converti:', authorId);

        logger.info(`[DELETE] /likes/${postId}/${authorId} - Suppression d'un like par postId et authorId`);

        const deletedLike = await Model.likes.delete(postId, authorId, response);
        
        if (!deletedLike) {
            logger.info("Like non trouvé");
            return APIResponse(response, null, "Like non trouvé", 404);
        }
        
        logger.info("Like supprimé avec succès");
        return APIResponse(response, deletedLike, "Like supprimé avec succès", 200);
    } catch (error : any) {
        logger.error("Erreur lors de la suppression du like: " + error.message);
        APIResponse(response, null, "Erreur lors de la suppression du like", 500);
    }
};

// Controller to retrieve likes from a specific user
export const getLikesByAuthorId = async (request: Request, response: Response) => {
    try {
        const authorId = new Types.ObjectId(request.params.userId);
        logger.info(`[GET] /likes/${authorId} - Récupération des likes par authorId`);
     
        const likes = await Model.likes.findByAuthor(authorId, response);
        
        if (!likes || likes.length === 0) {
            logger.warn("Aucun like trouvé pour cet utilisateur");
            return APIResponse(response, [], "Aucun like trouvé pour cet utilisateur", 404);
        }

        logger.info("Likes récupérés avec succès");
        return APIResponse(response, likes, "Likes récupérés avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des likes de l'utilisateur: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des likes de l'utilisateur", 500);
    }
};

// Controller to retrieve likes from a specific post
export const getLikesByPostId = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        logger.info(`[GET] /likes/${postId} - Récupération des likes par postId`);

        const likes = await Model.likes.findByPost(postId, response);

        if (!likes || likes.length === 0) {
            logger.warn("Aucun like trouvé pour ce post");
            return APIResponse(response, [], "Aucun like trouvé pour ce post", 404);
        }

        logger.info("Likes récupérés avec succès");
        return APIResponse(response, likes, "Likes récupérés avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des likes du post: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des likes du post", 500);
    }
};

// Controller to retrieve likes from a specific animal
export const getLikesByAnimalId = async (request: Request, response: Response) => {
    try {
        const animalId = new Types.ObjectId(request.params.animalId);
        logger.info(`[GET] /likes/${animalId} - Récupération des likes par animalId`);

        const likes = await Model.likes.findByAnimal(animalId, response);

        if (!likes || likes.length === 0) {
            logger.warn("Aucun like trouvé pour cet animal");
            return APIResponse(response, [], "Aucun like trouvé pour cet animal", 404);
        }

        logger.info("Likes récupérés avec succès");
        return APIResponse(response, likes, "Likes récupérés avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des likes de l'animal: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des likes de l'animal", 500);
    }
};