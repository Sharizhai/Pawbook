import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";

// Controller to retrieve all the followers
export const getFollowers = async (response: Response) => {
    try {
        const followers = await Model.followers.get(response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des followers :", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des followers", 500);
    }
};

// Controller to retrieve a follower by its ID
export const getFollowerById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        await Model.followers.where(id, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du follower :", error);
        APIResponse(response, null, "Erreur lors de la recherche du follower", 500);
    }
};

// Controller to create a new follower
export const createAFollower = async (request: Request, response: Response) => {
    try {
        const followerData = request.body;
        await Model.followers.create(followerData, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la création du follower :", error);
        APIResponse(response, null, "Erreur lors de la création du follower", 500);
    }
};

// Controller to delete a follower by its ID
export const deleteFollowerById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);

        await Model.followers.delete(id, authorId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la suppression du follower :", error);
        APIResponse(response, null, "Erreur lors de la suppression du follower", 500);
    }
};

// Controller to retrieve followers from a specific user
export const getFollowersByUserId = async (request: Request, response: Response) => {
    try {
        const userId = new Types.ObjectId(request.params.userId);
        await Model.followers.findByUser(userId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des followers de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des followers de l'utilisateur", 500);
    }
};