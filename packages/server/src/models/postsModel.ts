import { Response } from "express";
import { Types } from "mongoose";

import Post from "../schemas/posts";
import User from "../schemas/users";

import { IPost } from "../types/IPost";

//CRUD to get all posts
export const getAllPosts = async (skip: number, limit: number): Promise<{ posts: IPost[], totalPosts: number }> => {
    try {
        const totalPosts = await Post.countDocuments();
        
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'authorId',
                select: 'name firstName profilePicture',
            })
            .populate({
                path: 'likes',
                populate: {
                    path: 'authorId',
                    select: '_id name firstName profilePicture'
                }
            })
            .exec();
        
        return { posts, totalPosts };
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les posts:", error);
        throw new Error("Erreur lors de la récupération de tous les posts");
    }
};

//CRUD to get a post from it's id
export const findPostById = async (id: Types.ObjectId, response: Response): Promise<{ post: IPost } | null> => {
    try {
        const post = await Post.findById(id).populate({
            path: "authorId",
            select: "name firstName profilPicture"
        }).populate({
            path: "likes",
            populate: {
                path: "authorId",
                select: "_id"
            }
        }).exec();

        if (!post) {
            return null;
        }

        console.log('Post trouvé:', post);

        const result = { post: post.toObject() };
        return result;
    } catch (error: any) {
        console.error(error);
        return null;
    }
};

//CRUD to create a new post
export const createPost = async (post: Partial<IPost>, response: Response): Promise<IPost | null> => {
    try {
        const newPost = await Post.create(post);

        // Met à jour l'utilisateur pour ajouter l'ID du nouveau post
        await User.findByIdAndUpdate(post.authorId, {
            $push: { posts: newPost._id } // Ajoute le post au tableau de posts de l'utilisateur
        });

        return newPost;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to delete a post by it's id
export const deletePost = async (id: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<IPost | null> => {
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: id, authorId });

        if (!deletedPost) {
            return null;
        }

        return deletedPost;
    } catch (error) {
        console.error(error);
        return null;
    }
};

//CRUD to update a post by it's id
export const updatePost = async (id: Types.ObjectId, postData: Partial<IPost>, response: Response): Promise<IPost | null> => {
    try {
        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            postData,
            { new: true }
        ).exec();

        if (!updatedPost) {
            return null;
        }

        return updatedPost;
    } catch (error) {
        console.error(error);

        return null;
    }
};


//CRUD to get all posts by their user ID
export const findPostsByAuthorId = async (authorId: Types.ObjectId, skip: number, limit: number): Promise<{ posts: IPost[], totalPosts: number }> => {
    try {
        const user = await User.findById(authorId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const totalPosts = await Post.countDocuments({ authorId: authorId });
        
        const posts = await Post.find({ authorId: authorId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'authorId',
                select: 'name firstName profilePicture',
            })
            .populate({
                path: 'likes',
                populate: {
                    path: 'authorId',
                    select: '_id name firstName profilePicture'
                }
            })
            .exec();
        
        return { posts, totalPosts };
    } catch (error) {
        console.error("Erreur lors de la recherche des posts par utilisateur :", error);
        throw error;
    }
};