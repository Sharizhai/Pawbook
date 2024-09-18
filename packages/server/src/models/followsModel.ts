import { Response } from "express";
import { Types } from "mongoose";

import { APIResponse } from "../utils/responseUtils";

import Follow from "../schemas/follows";

import { IFollow } from "../types/IFollow";

//CRUD to get all follows
export const getAllFollows = async (response: Response): Promise<IFollow[] | null> => {
    try {
        const follows = await Follow.find()
            .populate("followedUser", "name firstName profilePicture")
            .exec();
        APIResponse(response, follows, "Liste de tous les follows récupérée avec succès");
        return follows;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des follows", 500);
        return null;
    }
};

//CRUD to get a follow from its id
export const findFollowByFollowerId = async (id: Types.ObjectId, response: Response): Promise<IFollow | null> => {
    try {
        const follow = await Follow.findById(id)
            .populate("followedUser", "name firstName profilePicture")
            .exec();
        if (!follow) {
            APIResponse(response, null, "Follow non trouvé", 404);
            return null;
        }
        APIResponse(response, follow, "Follow trouvé");
        return follow;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche du follow", 500);
        return null;
    }
};

//CRUD to create a new follow
export const createFollow = async (follow: Partial<IFollow>, response: Response): Promise<IFollow | null> => {
    try {
        const newFollow = await Follow.create(follow);

        APIResponse(response, newFollow, "Follow créé avec succès", 201);
        return newFollow;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de l'ajout du follow", 500);
        return null;
    }
};

//CRUD to delete a follow by its id
export const deleteFollow = async (id: Types.ObjectId, userId: Types.ObjectId, response: Response): Promise<IFollow | null> => {
    try {
        const deletedFollow = await Follow.findOneAndDelete({ _id: id, userId });

        if (!deletedFollow) {
            APIResponse(response, null, "Follow non trouvé ou vous n'êtes pas autorisé à le supprimer", 404);
            return null;
        }

        APIResponse(response, deletedFollow, "Follow supprimé avec succès");
        return deletedFollow;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression du follow", 500);
        return null;
    }
};

//CRUD to get all follows by their user ID
export const findFollowsByUserId = async (userId: Types.ObjectId, response: Response): Promise<IFollow[] | null> => {
    try {
        const follows = await Follow.find({ userId }).exec();

        if (follows.length === 0) {
            APIResponse(response, null, "Aucun follow trouvé pour cet utilisateur", 404);
            return null;
        }
        APIResponse(response, follows, "Follows trouvés pour cet utilisateur");
        return follows;
    } catch (error) {
        console.error("Erreur lors de la recherche des follows par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des follows de l'utilisateur", 500);
        return null;
    }
};