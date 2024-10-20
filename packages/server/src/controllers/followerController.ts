import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";

// Controller to retrieve all the followers
export const getFollowers = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /followers - Récupération de tous les followers");
        const followers = await Model.followers.get(response);
        
        if (followers) {
            logger.info("Liste de tous les followers récupérée avec succès");
            APIResponse(response, followers, "Liste de tous les followers récupérée avec succès", 200);
        } else {
            logger.warn("Aucun follower trouvé");
            APIResponse(response, null, "Aucun follower trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des followers: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des followers", 500);
    }
};

// Controller to retrieve a follower by its ID
export const getFollowerById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /followers/${id} - Récupération du follower via son ID`);

        const follower = await Model.followers.where(id, response);

        if (follower) {
            logger.info("Follower récupéré avec succès");
            APIResponse(response, follower, "Follower récupéré avec succès", 200);
        } else {
            logger.warn("Follower non trouvé");
            APIResponse(response, null, "Follower non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la recherche du follower: " + error.message);
        APIResponse(response, null, "Erreur lors de la recherche du follower", 500);
    }
};

// Controller to create a new follower
export const createAFollower = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /followers/register - Création d'un nouveau follower");
        const followerData = request.body;

        const newFollower = await Model.followers.create(followerData, response);

        if (newFollower) {
            logger.info("Nouveau follower créé avec succès");
            APIResponse(response, newFollower, "Follower créé avec succès", 201);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la création du follower: " + error.message);
        APIResponse(response, null, "Erreur lors de la création du follower", 500);
    }
};


// Controller to delete a follower by its ID
export const deleteFollowerById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);
        logger.info(`[DELETE] /followers/${id}/${authorId} - Suppression d'un follower par ID`);

        const deletedFollower = await Model.followers.delete(id, authorId, response);

        if (deletedFollower) {
            logger.info("Follower supprimé avec succès");
            APIResponse(response, deletedFollower, "Follower supprimé avec succès", 200);
        } else {
            logger.warn("Follower non trouvé");
            APIResponse(response, null, "Follower non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la suppression du follower: " + error.message);
        APIResponse(response, null, "Erreur lors de la suppression du follower", 500);
    }
};

// Controller to retrieve followers from a specific user
export const getFollowersByUserId = async (request: Request, response: Response) => {
    try {
        const userId = new Types.ObjectId(request.params.authorId);
        logger.info(`[GET] /followers/user/${userId} - Récupération des followers par userId`);

        const followers = await Model.followers.findByUser(userId, response);

        if (followers && followers.length > 0) {
            logger.info("Followers récupérés avec succès");
            APIResponse(response, followers, "Followers récupérés avec succès", 200);
        } else {
            logger.warn("Aucun follower trouvé pour cet utilisateur");
            APIResponse(response, [], "Aucun follower trouvé pour cet utilisateur", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des followers de l'utilisateur: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des followers de l'utilisateur", 500);
    }
};