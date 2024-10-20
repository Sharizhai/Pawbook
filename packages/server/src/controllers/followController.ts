import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";

// Controller to retrieve all the follows
export const getFollows = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /follows - Récupération de tous les followers");
        const follows = await Model.follows.get(response);
        
        logger.info("Follows retrieved successfully");
        return APIResponse(response, follows, "Follows retrieved successfully", 200);
    } catch (error) {
        logger.error("Error retrieving follows: ", error);
        return APIResponse(response, null, "Error retrieving follows", 500);
    }
};

// Controller to retrieve a follow by its ID
export const getFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /follows/${id} - Récupération du follower via son ID`);

        const follow = await Model.follows.where(id, response);

        if (!follow) {
            logger.warn(`Follow not found with ID: ${request.params.id}`);
            return APIResponse(response, null, "Follow not found", 404);
        }

        logger.info(`Follow retrieved successfully with ID: ${request.params.id}`);
        return APIResponse(response, follow, "Follow retrieved successfully", 200);
    } catch (error) {
        logger.error("Error retrieving follow: ", error);
        return APIResponse(response, null, "Error retrieving follow", 500);
    }
};

// Controller to create a new follow
export const createAFollow = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /followers/register - Création d'un nouveau follower");
        const followData = request.body;

        const newFollow = await Model.follows.create(followData, response);
        
        logger.info("Follow created successfully");
        return APIResponse(response, newFollow, "Follow created successfully", 201);
    } catch (error) {
        logger.error("Error creating follow: ", error);
        return APIResponse(response, null, "Error creating follow", 500);
    }
};

// Controller to delete a follow by its ID
export const deleteFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);
        logger.info(`[DELETE] /follows/${id}/${authorId} - Suppression d'un follower par ID`);

        const deletedFollow = await Model.follows.delete(id, authorId, response);
        
        if (!deletedFollow) {
            logger.warn(`Follow not found for deletion with ID: ${request.params.id}`);
            return APIResponse(response, null, "Follow not found", 404);
        }

        logger.info(`Follow deleted successfully with ID: ${request.params.id}`);
        return APIResponse(response, deletedFollow, "Follow deleted successfully", 200);
    } catch (error) {
        logger.error("Error deleting follow: ", error);
        return APIResponse(response, null, "Error deleting follow", 500);
    }
};

// Controller to retrieve follows from a specific user
export const getFollowsByAuthorId = async (request: Request, response: Response) => {
    try {
        const userId = new Types.ObjectId(request.params.userId);
        logger.info(`[GET] /follows/user/${userId} - Récupération des followers par userId`);

        const follows = await Model.follows.findByUser(userId, response);
        
        if (follows && follows.length > 0) {
            logger.warn(`No follows found for user ID: ${request.params.userId}`);
            return APIResponse(response, null, "No follows found", 404);
        }
        logger.info(`Follows retrieved for user ID: ${request.params.userId}`);
        return APIResponse(response, follows, "Follows retrieved successfully", 200);
    } catch (error) {
        logger.error("Error retrieving follows by author ID: ", error);
        return APIResponse(response, null, "Error retrieving follows", 500);
    }
};