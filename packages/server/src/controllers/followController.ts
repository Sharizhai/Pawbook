import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";
import { followValidation } from "../validation/validation";

// Controller to retrieve all the follows
export const getFollows = async (request: Request, response: Response) => {
    try {
        const follows = await Model.follows.get(response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des follows :", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des follows", 500);
    }
};

// Controller to retrieve a follow by its ID
export const getFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        await Model.follows.where(id, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du follow :", error);
        APIResponse(response, null, "Erreur lors de la recherche du follow", 500);
    }
};

// Controller to create a new follow
export const createAFollow = async (request: Request, response: Response) => {
    try {
        const followData = request.body;
        const validatedData = followValidation.parse(followData);
        
        const newFollowData = {
            followerUser: new Types.ObjectId(validatedData.followerUser),
            followedUser: new Types.ObjectId(validatedData.followedUser),
        }

        const newFollow = await Model.follows.create(newFollowData, response);

        return APIResponse(response, newFollow, "Follow créé avec succès", 201);

    } catch (error) {
        console.error("Erreur lors de la création du follow :", error);
        APIResponse(response, null, "Erreur lors de la création du follow", 500);
    }
};

// Controller to delete a follow by its ID
export const deleteFollowById = async (request: Request, response: Response) => {
    try {
        const followerUser = new Types.ObjectId(request.params.followerUser);
        const followedUser = new Types.ObjectId(request.params.followedUser);

        const deletedFollow = await Model.follows.delete(followerUser, followedUser, response);
        
        if (!deletedFollow) {
            return APIResponse(response, null, "Follow non trouvé", 404);
        }
        
        return APIResponse(response, deletedFollow, "Follow supprimé avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la suppression du follow :", error);
        APIResponse(response, null, "Erreur lors de la suppression du follow", 500);
    }
};

// Controller to retrieve follows from a specific user
export const getFollowsByAuthorId = async (request: Request, response: Response) => {
    try {
        console.log('Reçu userId:', request.params.userId);

        const userId = new Types.ObjectId(request.params.userId);
        await Model.follows.findByUser(userId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des follows de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des follows de l'utilisateur", 500);
    }
};