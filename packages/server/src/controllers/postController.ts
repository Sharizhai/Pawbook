import { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";

import { postValidation } from "../validation/validation";

//Controller pour récupérer tous les posts
export const getPosts = async (request: Request, response: Response) => {
    try {
        const posts = await Model.posts.get(response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des posts", 500);
    }
};

//Controller pour récupérer un post par son id
export const getPostById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const post = await Model.posts.where(id, response);

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du post :", error);
        APIResponse(response, null, "Erreur lors de la recherche du post", 500);
    }
};

//Controller pour créer un nouveau post
export const createAPost = async (request: Request, response: Response) => {
    try {
        const postData = request.body;

        const validatedData = postValidation.parse(postData);

        const newPostData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            textContent: validatedData.textContent,
            //photoContent: validatedData.photoContent
        };

        const newPost = await Model.posts.create(newPostData, response);

        APIResponse(response, newPost, "Post créé avec succès", 201);
    } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        if (error instanceof z.ZodError) {
            APIResponse(response, null, "Données invalides : " + error.errors.map(e => e.message).join(", "), 400);
        } else {
            APIResponse(response, null, "Erreur lors de la création du post", 500);
        }
    }
};

//Controller pour supprimer un post en fonction de son ID
export const deletePostById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const authorId = request.params.authorId;

        await Model.posts.delete(new Types.ObjectId(id), new Types.ObjectId(authorId), response);

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error){
            console.error("Erreur lors de la suppression du post :", error);
            APIResponse(response, null, "Erreur lors de la suppression du post", 500);
    }
};

// Controller pour mettre à jour un post
export const updatePost = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const post = request.body;

        await Model.posts.update(new Types.ObjectId(id), post, response);

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error){
            console.error("Erreur lors de la mise à jour du post :", error);
            APIResponse(response, null, "Erreur lors de la mise à jour du post", 500);
    }
};

// Controller pour récupérer tous les posts d'un utilisateur spécifique
export const getPostsByAuthorId = async (request: Request, response: Response) => {
    try {
        console.log("Request Params:", request.params);
        const { authorId } = request.params;

        if (!authorId || authorId === 'undefined') {
            return APIResponse(response, null, "ID d'utilisateur manquant ou invalide", 400);
        }

        console.log("User ID (string):", authorId);

        if (!Types.ObjectId.isValid(authorId)) {
            return APIResponse(response, null, "ID d'utilisateur invalide", 400);
        }

        const objectIdUserId = new Types.ObjectId(authorId);
        console.log("User ID (ObjectId):", objectIdUserId);

        const posts = await Model.posts.findByAuthor(objectIdUserId);
        console.log("Posts found:", posts);

        if (!posts || posts.length === 0) {
            return APIResponse(response, [], "Aucun post trouvé pour cet utilisateur", 404);
        }

        return APIResponse(response, posts, "Posts récupérés avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des posts de l'utilisateur", 500);
    }
};