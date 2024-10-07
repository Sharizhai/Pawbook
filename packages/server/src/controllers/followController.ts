import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";

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
        await Model.follows.create(followData, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la création du follow :", error);
        APIResponse(response, null, "Erreur lors de la création du follow", 500);
    }
};

// Controller to delete a follow by its ID
export const deleteFollowById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);

        await Model.follows.delete(id, authorId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la suppression du follow :", error);
        APIResponse(response, null, "Erreur lors de la suppression du follow", 500);
    }
};

// Controller to retrieve follows from a specific user
export const getFollowsByAuthorId = async (request: Request, response: Response) => {
    try {
        const userId = new Types.ObjectId(request.params.userId);
        await Model.follows.findByUser(userId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des follows de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des follows de l'utilisateur", 500);
    }
};