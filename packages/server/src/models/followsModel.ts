import { Response } from "express";
import { Types } from "mongoose";

import Follow from "../schemas/follows";
import { IFollow } from "../types/IFollow";
import User from "../schemas/users";

//CRUD to get all follows
export const getAllFollows = async (response: Response): Promise<IFollow[] | null> => {
    try {
        const follows = await Follow.find()
            .populate("followedUser", "name firstName profilePicture")
            .exec();
            
        return follows;
    } catch (error) {
        console.error(error);

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
            return null;
        }
        
        return follow;
    } catch (error: any) {
        console.error(error);
        
        return null;
    }
};

//CRUD to create a new follow
export const createFollow = async (follow: Partial<IFollow>, response: Response): Promise<IFollow | null> => {
    try {
        const newFollow = await Follow.create(follow);

        await User.findByIdAndUpdate(follow.followerUser, {
            $push: { follows: newFollow._id } // Ajoute le follow au tableau de follows du user
        });

        await User.findByIdAndUpdate(follow.followedUser, {
            $push: { followers: newFollow._id } // Ajoute le follow au tableau de followers du user suivi
        });
        
        return newFollow;
    } catch (error) {
            console.error(error);

        return null;
    }
};

//CRUD to delete a follow by its id
export const deleteFollow = async (id: Types.ObjectId, userId: Types.ObjectId, response: Response): Promise<IFollow | null> => {
    try {
        const deletedFollow = await Follow.findOneAndDelete({ _id: id, userId });

        if (!deletedFollow) {
            return null;
        }

        return deletedFollow;
    } catch (error) {
        console.error(error);
        
        return null;
    }
};

//CRUD to get all follows by their user ID
export const findFollowsByUserId = async (userId: Types.ObjectId, response: Response): Promise<IFollow[] | null> => {
    try {
        const follows = await Follow.find({ userId })
            .populate('followedUser', '_id')
            .exec();

        if (follows.length === 0) {
            return null;
        }
        
        return follows;
    } catch (error) {
        console.error(error);
        
        return null;
    }
};