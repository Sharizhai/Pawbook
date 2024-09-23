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

        APIResponse(response, posts, "Liste de tous les posts récupérée avec succès");
        return posts;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des posts", 500);
        return [];
    }
};

//CRUD to get a post from it's id
export const findPostById = async (id: Types.ObjectId, response: Response): Promise<{ post: IPost } | null> => {
    try {
        const post = await Post.findById(id).populate({
            path: "authorId",
            select: "name email"
        }).exec();

        if (!post) {
            APIResponse(response, null, "Post non trouvé", 404);
            return null;
        }

        const result = { post: post.toObject() };

        APIResponse(response, result, "Post trouvé");
        return result;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche du post", 500);
        return null;
    }
};

//CRUD to create a new post
export const createPost = async (post: Partial<IPost>, response: Response): Promise<IPost | null> => {
    try {
        // Validation des données du post avec Zod
        postValidation.parse(post);

        const newPost = await Post.create(post);

        APIResponse(response, newPost, "Post créé avec succès", 201);
        return newPost;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données du post invalides", 400);
        } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de la création du post", 500);
        }
        return null;
    }
};

//CRUD to delete a post by it's id
export const deletePost = async (id: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<IPost | null> => {
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: id, authorId });

        if (!deletedPost) {
            APIResponse(response, null, "Post non trouvé ou vous n'êtes pas autorisé à la supprimer", 404);
            return null;
        }

        APIResponse(response, deletedPost, "Post supprimé avec succès");
        return deletedPost;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression du post", 500);
        return null;
    }
};

//CRUD to update a post by it's id
export const updatePost = async (id: Types.ObjectId, postData: Partial<IPost>, response: Response): Promise<IPost | null> => {
    try {
        // Validation des données du post avec Zod
        postValidation.parse(postData);

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            postData,
            { new: true }
        ).exec();

        if (!updatedPost) {
            APIResponse(response, null, "Post non trouvé ou vous n'êtes pas autorisé à le modifier", 404);
            return null;
        }

        APIResponse(response, updatedPost, "Post mis à jour avec succès");
        return updatedPost;
    } catch (error) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données du post invalides", 400);
        } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de la mise à jour du post", 500);
        }
        return null;
    }
};


//CRUD to get all posts by their user ID
export const findPostsByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<IPost[] | null> => {
    try {
        const posts = await Post.find({ authorId }).exec();

        if (posts.length === 0) {
            APIResponse(response, null, "Aucun post trouvé pour cet utulisateur", 404);
            return null;
        }
        APIResponse(response, posts, "Posts trouvés pour cet utilisateur");
        return posts;
    } catch (error) {
        console.error("Erreur lors de la recherche des posts par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des posts de l'utilisateur", 500);
        return null;
    }
};