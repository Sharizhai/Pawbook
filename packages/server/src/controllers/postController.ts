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

        postValidation.parse(postData);

        // On crée le nouveau post 
        const newPostData = {
            authorId: postData.authorId,
            textContent: postData.textContent,
            photoContent: postData.photoContent
        };

        //Le nouveau post est ajouté à la base de données
        const newPost = await Model.posts.create(newPostData, response);

        APIResponse(response, newPost, "Post créé avec succès", 201);
    } catch (error){
            console.error("Erreur lors de la création du post :", error);
            APIResponse(response, null, "Erreur lors de la création du post", 500);
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
        const authorId = new Types.ObjectId(request.params.userId);
        const posts = await Model.posts.findByAuthor(authorId, response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des posts de l'utilisateur", 500);
    }
};

export const getPostByMe = async (request: Request, response: Response) => {
    try {
        const id = response.locals.user.id;
        await Model.posts.findByAuthor(id, response);

        APIResponse(response, id, "", 200);
    } catch (error: unknown) {
        console.error("Erreur lors de la récupération de l'id pour le profil :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
}