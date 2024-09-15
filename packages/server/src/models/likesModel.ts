import { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";

import Like from "../schemas/likes";

import { ILike } from "../types/ILike";

//CRUD to get all likes
export const getAllLikes = async (response: Response): Promise<ILike[]> => {
    try {
        const likes = await Like.find().select("authorId").exec();

        APIResponse(response, likes, "Liste de tous les likes récupérée avec succès");
        return likes;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des likes", 500);
        return [];
    }
};

//CRUD to get a like from it's id
export const findLikeById = async (id: Types.ObjectId, response: Response): Promise<{ like: ILike } | null> => {
    try {
        const like = await Like.findById(id).populate({
            path: "authorId",
            select: "name email"
        }).exec();

        if (!like) {
            APIResponse(response, null, "Like non trouvé", 404);
            return null;
        }

        const result = { like: like.toObject() };

        APIResponse(response, result, "Like trouvé");
        return result;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche du like", 500);
        return null;
    }
};

//CRUD to create a new like
export const createLike = async (like: Partial<ILike>, response: Response): Promise<ILike | null> => {
    try {
        const newLike = await Like.create(like);

        APIResponse(response, newLike, "Like ajouté avec succès", 201);
        return newLike;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données du like invalides", 400);
        } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de l'ajout du like", 500);
        }
        return null;
    }
};

//CRUD to delete a like by it's id
export const deleteLike = async (id: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<{ deletedCount: number }> => {
    try {
        const result = await Like.deleteOne({ _id: id, authorId });

        if (result.deletedCount === 0) {
            APIResponse(response, null, "Like non trouvé", 404);
        } else {
            APIResponse(response, result, "Like supprimé avec succès");
        }
        return result;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression du like", 500);
        return { deletedCount: 0 };
    }
};

//CRUD to update a like by it's id
export const updateLike = async (id: Types.ObjectId, likeData: Partial<ILike>, response: Response): Promise<ILike | null> => {
    try {
        const updateLike = await Like.findByIdAndUpdate(id, likeData, { new: true }).exec();

        if (!updateLike) {
            APIResponse(response, null, "Like non trouvé", 404);
            return null;
        }
        APIResponse(response, updateLike, "Like mis à jour avec succès");
        return updateLike;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données invalides", 400);
        } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de la mise à jour du like", 500);
        }
        return null;
    }
};


//CRUD to get all likes by their user ID
export const findLikesByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ authorId }).exec();

        if (likes.length === 0) {
            APIResponse(response, null, "Aucun like trouvé pour cet utilisateur", 404);
            return null;
        }
        APIResponse(response, likes, "Likes trouvés pour cet utilisateur");
        return likes;
    } catch (error) {
        console.error("Erreur lors de la recherche des likes par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des likes de l'utilisateur", 500);
        return null;
    }
};

//CRUD to get all like by a post ID
export const findLikesByPostId = async (postId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ postId }).exec();

        if (likes.length === 0) {
            APIResponse(response, null, "Aucun like trouvé pour ce post", 404);
            return null;
        }
        APIResponse(response, likes, "Likes trouvés pour ce post");
        return likes;
    } catch (error) {
        console.error("Erreur lors de la recherche des likes par post :", error);
        APIResponse(response, null, "Erreur lors de la recherche des likes du post", 500);
        return null;
    }
};

//CRUD to get all like by an animal ID
export const findPostsByAnimalId = async (animalId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ animalId }).exec();

        if (likes.length === 0) {
            APIResponse(response, null, "Aucun like trouvé pour cet animal", 404);
            return null;
        }
        APIResponse(response, likes, "Likes trouvés pour cet animal");
        return likes;
    } catch (error) {
        console.error("Erreur lors de la recherche des likes par animal :", error);
        APIResponse(response, null, "Erreur lors de la recherche des likes de l'animal", 500);
        return null;
    }
};