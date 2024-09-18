import { Response } from "express";
import { Types } from "mongoose";

import { APIResponse } from "../utils/responseUtils";

import Follower from "../schemas/followers";

import { IFollower } from "../types/IFollower";

//CRUD to get all followers
export const getAllFollowers = async (response: Response): Promise<IFollower[] | null> => {
    try {
        const followers = await Follower.find()
            .populate("followerUser", "name firstName profilePicture")
            .exec();
        APIResponse(response, followers, "Liste de tous les followers récupérée avec succès");
        return followers;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des followers", 500);
        return null;
    }
};

//CRUD to get a follower from its id
export const findFollowerByFollowedUserId = async (id: Types.ObjectId, response: Response): Promise<IFollower | null> => {
    try {
        const follower = await Follower.findById(id)
            .populate("followerUser", "name firstName profilePicture")
            .exec();
        if (!follower) {
            APIResponse(response, null, "Follower non trouvé", 404);
            return null;
        }

        APIResponse(response, follower, "Follower trouvé");
        return follower;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche du follower", 500);
        return null;
    }
};

//CRUD to create a new follower
export const createFollower = async (follower: Partial<IFollower>, response: Response): Promise<IFollower | null> => {
    try {
        const newFollower = await Follower.create(follower);

        APIResponse(response, newFollower, "Follower créé avec succès", 201);
        return newFollower;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de l'ajout du follower", 500);
        return null;
    }
};

//CRUD to delete a follower by its id
export const deleteFollower = async (id: Types.ObjectId, userId: Types.ObjectId, response: Response): Promise<IFollower | null> => {
    try {
        const deletedFollower = await Follower.findOneAndDelete({ _id: id, userId });

        if (!deletedFollower) {
            APIResponse(response, null, "Follower non trouvé ou vous n'êtes pas autorisé à le supprimer", 404);
            return null;
        }

        APIResponse(response, deletedFollower, "Follower supprimé avec succès");
        return deletedFollower;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression du follower", 500);
        return null;
    }
};

//CRUD to get all followers by their user ID
export const findFollowersByUserId = async (userId: Types.ObjectId, response: Response): Promise<IFollower[] | null> => {
    try {
        const followers = await Follower.find({ userId }).exec();

        if (followers.length === 0) {
            APIResponse(response, null, "Aucun follower trouvé pour cet utilisateur", 404);
            return null;
        }
        APIResponse(response, followers, "Followers trouvés pour cet utilisateur");
        return followers;
    } catch (error) {
        console.error("Erreur lors de la recherche des follows par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des followers de l'utilisateur", 500);
        return null;
    }
};