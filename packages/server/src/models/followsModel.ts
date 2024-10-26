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
export const deleteFollow = async (followerUser: Types.ObjectId, followedUser: Types.ObjectId, response: Response): Promise<IFollow | null> => {
    try {
        const deletedFollow = await Follow.findOneAndDelete({ 
            followerUser: followerUser, 
            followedUser : followedUser
        });

        if (!deletedFollow) {
            return null;
        }

        await User.findByIdAndUpdate(deletedFollow.followerUser, {
            $pull: { follows: deletedFollow._id } // Retire le follow au tableau de follows du user
        });

        await User.findByIdAndUpdate(deletedFollow.followedUser, {
            $pull: { followers: deletedFollow._id } // Retire le follow au tableau de followers du user suivi
        });

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