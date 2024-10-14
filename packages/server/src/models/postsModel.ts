import { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { postValidation } from "../validation/validation";

import { APIResponse } from "../utils/responseUtils";

import Post from "../schemas/posts";

import { IPost } from "../types/IPost";

//CRUD to get all posts
export const getAllPosts = async (response: Response): Promise<IPost[]> => {
    try {
        const posts = await Post.find().select("authorId textContent photoContent comments").exec();

        return posts;
    } catch (error) {
        console.error(error);
        return [];
    }
};

//CRUD to get a post from it's id
export const findPostById = async (id: Types.ObjectId, response: Response): Promise<{ post: IPost } | null> => {
    try {
        const post = await Post.findById(id).populate({
            path: "authorId",
            select: "name firstName profilPicture"
        }).exec();

        if (!post) {
            return null;
        }

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
export const findPostsByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<IPost[] | null> => {
    try {
        const posts = await Post.find({ authorId }).exec();

        if (posts.length === 0) {
            return null;
        }

        return posts;
    } catch (error) {
        console.error("Erreur lors de la recherche des posts par utilisateur :", error);

        return null;
    }
};