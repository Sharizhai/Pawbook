import { Response } from "express";
import { Types } from "mongoose";

import Follower from "../schemas/followers";
import { IFollower } from "../types/IFollower";

//CRUD to get all followers
export const getAllFollowers = async (response: Response): Promise<IFollower[] | null> => {
    try {
        const followers = await Follower.find()
            .populate("followerUser", "name firstName profilePicture")
            .exec();

        return followers;

    } catch (error) {
        console.error(error);

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
            return null;
        }

        return follower;
    } catch (error: any) {
        console.error(error);

        return null;
    }
};

//CRUD to create a new follower
export const createFollower = async (follower: Partial<IFollower>, response: Response): Promise<IFollower | null> => {
    try {
        const newFollower = await Follower.create(follower);

        return newFollower;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to delete a follower by its id
export const deleteFollower = async (id: Types.ObjectId, userId: Types.ObjectId, response: Response): Promise<IFollower | null> => {
    try {
        const deletedFollower = await Follower.findOneAndDelete({ _id: id, userId });

        if (!deletedFollower) {
            return null;
        }

        return deletedFollower;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to get all followers by their user ID
export const findFollowersByUserId = async (userId: Types.ObjectId, response: Response): Promise<IFollower[] | null> => {
    try {
        const followers = await Follower.find({ userId }).exec();

        if (followers.length === 0) {
            return null;
        }

        return followers;
    } catch (error) {
        console.error("Erreur lors de la recherche des follows par utilisateur :", error);

        return null;
    }
};