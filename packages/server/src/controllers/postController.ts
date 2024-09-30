import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";

//On récupère tous les posts
export const getPosts = async (response: Response) => {
    try {
        const posts = await Model.posts.get(response);
        APIResponse(response, posts, "Liste de tous les posts récupérée avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des posts", 500);
    }
};

//On récupère un post par son id
export const getPostById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const post = await Model.posts.where(id, response);

        if (!post)
            return APIResponse(response, null, "Post non trouvé", 404);

        APIResponse(response, post, "Post trouvé", 200);
    } catch (error) {
        console.error("Erreur lors de la recherche du post :", error);
        APIResponse(response, null, "Erreur lors de la recherche du post", 500);
    }
};

//On crée un nouveau post
export const createAPost = async (request: Request, response: Response) => {
    try {
        const postData = request.body;

        // On crée le nouveau post 
        const newPostData = {
            authorId: postData.authorId,
            textContent: postData.textContent,
            photoContent: postData.photoContent
        };

        //Le nouveau post est ajouté à la base de données
        const newPost = await Model.posts.create(newPostData, response);

        APIResponse(response, newPost, "Post créé avec succès", 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            APIResponse(response, errorMessages, "Données du post invalides", 400);
        } else {
            console.error("Erreur lors de la création du post :", error);
            APIResponse(response, null, "Erreur lors de la création du post", 500);
        }
    }
};

//On supprime un post en fonction de son ID
export const deletePostById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const authorId = request.params.authorId;

        await Model.posts.delete(new Types.ObjectId(id), new Types.ObjectId(authorId), response);

        APIResponse(response, null, "Post deleted", 204);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            APIResponse(response, errorMessages, "Données du post invalides", 400);
        } else {
            console.error("Erreur lors de la suppression du post :", error);
            APIResponse(response, null, "Erreur lors de la suppression du post", 500);
        }
    }
};

// On met à jour un post
export const updatePost = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const post = request.body;

        await Model.posts.update(new Types.ObjectId(id), post, response);

        APIResponse(response, post, "Post updated", 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            APIResponse(response, errorMessages, "Données du post invalides", 400);
        } else {
            console.error("Erreur lors de la mise à jour du post :", error);
            APIResponse(response, null, "Erreur lors de la mise à jour du post", 500);
        }
    }
};

// Récupère tous les posts d'un utilisateur spécifique
export const getPostsByAuthorId = async (request: Request, response: Response) => {
    try {
        const authorId = new Types.ObjectId(request.params.userId);
        const posts = await Model.posts.findByAuthor(authorId, response);
        
        // La méthode findPostsByAuthorId gère déjà la réponse API, donc nous n'avons pas besoin d'appeler APIResponse ici. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des posts de l'utilisateur", 500);
    }
};