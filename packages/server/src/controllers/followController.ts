import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";

// Controller to retrieve all the follows
export const getFollows = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /follows - Récupération de tous les follows");
        const follows = await Model.follows.get(response);
        
        logger.info("Liste de tous les follows récupérée avec succès");
        APIResponse(response, follows, "Liste de tous les follows récupérée avec succès", 200);
    } catch (error) {
        logger.error("Erreur lors de la récupération des follows : ", error);
        return APIResponse(response, null, "Erreur lors de la récupération de la liste des follows", 500);
    }
};

// Controller to retrieve a follow by its ID
export const getFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /follows/${id} - Récupération du follow via son ID`);

        const follow = await Model.follows.where(id, response);

        if (follow) {
            logger.info("Follow récupéré avec succès");
            APIResponse(response, follow, "Follow récupéré avec succès", 200);
        } else {
            logger.warn("Follow non trouvé");
            APIResponse(response, null, "Follow non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la recherche du follow: " + error.message);
        APIResponse(response, null, "Erreur lors de la recherche du follow", 500);
    }
};

// Controller to create a new follow
export const createAFollow = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /follows/register - Création d'un nouveau follow");
        const followData = request.body;

        const newFollow = await Model.follows.create(followData, response);
        
        if (newFollow) {
            logger.info("Nouveau follow créé avec succès");
            APIResponse(response, newFollow, "Follow créé avec succès", 201);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la création du follow: " + error.message);
        APIResponse(response, null, "Erreur lors de la création du follow", 500);
    }
};

// Controller to delete a follow by its ID
export const deleteFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);
        logger.info(`[DELETE] /follows/${id}/${authorId} - Suppression d'un follow par ID`);

        const deletedFollow = await Model.follows.delete(id, authorId, response);
        
        if (deletedFollow) {
            logger.info("Follow supprimé avec succès");
            APIResponse(response, deletedFollow, "Follow supprimé avec succès", 200);
        } else {
            logger.warn("Follow non trouvé");
            APIResponse(response, null, "Follow non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la suppression du follow : " + error.message);
        APIResponse(response, null, "Erreur lors de la suppression du follow", 500);
    }
};

// Controller to retrieve follows from a specific user
export const getFollowsByAuthorId = async (request: Request, response: Response) => {
    try {
        const userId = new Types.ObjectId(request.params.userId);
        logger.info(`[GET] /follows/user/${userId} - Récupération des follows par userId`);

        const followers = await Model.followers.findByUser(userId, response);

        if (followers && followers.length > 0) {
            logger.info("Follows récupérés avec succès");
            APIResponse(response, followers, "Follows récupérés avec succès", 200);
        } else {
            logger.warn("Aucun follows trouvé pour cet utilisateur");
            APIResponse(response, [], "Aucun follows trouvé pour cet utilisateur", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des follows de l'utilisateur: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des follows de l'utilisateur", 500);
    }
};