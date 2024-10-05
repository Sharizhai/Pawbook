import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";

// Controller to retrieve all the likes
export const getLikes = async (response: Response) => {
    try {
        const likes = await Model.likes.get(response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des likes :", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des likes", 500);
    }
};

// Controller to retrieve a like by its ID
export const getLikeById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        await Model.likes.where(id, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du like :", error);
        APIResponse(response, null, "Erreur lors de la recherche du like", 500);
    }
};

// Controller to create a new like
export const createALike = async (request: Request, response: Response) => {
    try {
        const likeData = request.body;
        await Model.likes.create(likeData, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la création du like :", error);
        APIResponse(response, null, "Erreur lors de la création du like", 500);
    }
};

// Controller to delete a like by its ID
export const deleteLikeById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId);

        await Model.likes.delete(id, authorId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la suppression du like :", error);
        APIResponse(response, null, "Erreur lors de la suppression du like", 500);
    }
};

// Controller to retrieve likes from a specific user
export const getLikesByAuthorId = async (request: Request, response: Response) => {
    try {
        const authorId = new Types.ObjectId(request.params.userId);
        await Model.likes.findByAuthor(authorId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des likes de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des likes de l'utilisateur", 500);
    }
};

// Controller to retrieve likes from a specific post
export const getLikesByPostId = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        await Model.likes.findByPost(postId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des likes du post:", error);
        APIResponse(response, null, "Erreur lors de la récupération des likes du post", 500);
    }
};

// Controller to retrieve likes from a specific animal
export const getLikesByAnimalId = async (request: Request, response: Response) => {
    try {
        const animalId = new Types.ObjectId(request.params.animalId);
        await Model.likes.findByAnimal(animalId, response);
        
        // The model handles the API response. We simply return to terminate the function.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des likes du post:", error);
        APIResponse(response, null, "Erreur lors de la récupération des likes du post", 500);
    }
};