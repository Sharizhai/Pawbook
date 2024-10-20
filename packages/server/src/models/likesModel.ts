import { Response } from "express";
import { Types } from "mongoose";

import Like from "../schemas/likes";
import { ILike } from "../types/ILike";
import Post from "../schemas/posts";
import Animal from "../schemas/animals";

//CRUD to get all likes
export const getAllLikes = async (response: Response): Promise<ILike[]> => {
    try {
        const likes = await Like.find().select("authorId postId animalId").exec();

        return likes;
    } catch (error) {
        console.error(error);

        return [];
    }
};

//CRUD to get a like from its id
export const findLikeById = async (id: Types.ObjectId, response: Response): Promise<{ like: ILike } | null> => {
    try {
        const like = await Like.findById(id).populate([
            {
                path: "authorId",
                select: "name email"
            },
            {
                path: "postId",
                select: "authorId textContent photoContent comments"
            },
            {
                path: "animalId",
                select: "ownerId name race age"
            }
        ]).exec();

        if (!like) {
            return null;
        }

        const result = { like: like.toObject() };

        return result;
    } catch (error: any) {
        console.error(error);
        return null;
    }
};

//CRUD to create a new like
export const createLike = async (like: Partial<ILike>, response: Response): Promise<ILike | null> => {
    try {
        const newLike = await Like.create(like);

        await Post.findByIdAndUpdate(like.postId, {
            $push: { likes: newLike._id } // Ajoute le like au tableau de likes du post
        });
    
        return newLike; 
      } catch (error: any) {
        console.error(error);
        return null;
      }
};

//CRUD to delete a like by its id
export const deleteLike = async (postId: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<ILike | null> => {
    try {
        const deletedLike = await Like.findOneAndDelete({ 
            postId: postId, 
            authorId : authorId
        });
        
        if (!deletedLike) {
            return null;
        }

        await Post.findByIdAndUpdate(deletedLike.postId, {
            $pull: { likes: deletedLike._id }
        });

        return deletedLike;
    } catch (error) {
        console.error(error);
        return null;
    }
};

//CRUD to get all likes by their user ID
export const findLikesByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ authorId }).exec();

        if (likes.length === 0) {
            return null;
        }

        return likes;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to get all like by a post ID
export const findLikesByPostId = async (postId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ postId }).exec();

        if (likes.length === 0) {
            return null;
        }

        return likes;
    } catch (error) {
        console.error(error);
        return null;
    }
};

//CRUD to get all like by an animal ID
export const findLikesByAnimalId = async (animalId: Types.ObjectId, response: Response): Promise<ILike[] | null> => {
    try {
        const likes = await Like.find({ animalId }).exec();

        if (likes.length === 0) {
            return null;
        }

        return likes;
    } catch (error) {
        console.error(error);

        return null;
    }
};