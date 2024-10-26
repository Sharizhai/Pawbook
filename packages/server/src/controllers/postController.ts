import { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { postValidation } from "../validation/validation";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";


//Controller pour récupérer tous les posts
export const getPosts = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /posts - Récupération de tous les utilisateurs");
        const posts = await Model.posts.get(response);
        
        logger.info("Liste de tous les posts récupérée avec succès");
        APIResponse(response, posts, "Liste de tous les posts récupérée avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des posts: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des posts", 500);
    }
};

//Controller pour récupérer un post par son id
export const getPostById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /posts/${id} - Récupération du post via son ID`);

        const post = await Model.posts.where(id, response);

        if (post) {
            logger.info("Post récupéré avec succès");
            APIResponse(response, post, "Post récupéré avec succès", 200);
        } else {
            logger.info("Post non trouvé");
            APIResponse(response, null, "Post non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la recherche de l'utilisateur:", error.message);
        APIResponse(response, null, "Erreur lors de la recherche du post", 500);
    }
};

//Controller pour créer un nouveau post
export const createAPost = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /posts/register - Création d'un nouveau post");
        const postData = request.body;

        const validatedData = postValidation.parse(postData);

        const newPostData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            textContent: validatedData.textContent,
            //photoContent: validatedData.photoContent
        };

        const newPost = await Model.posts.create(newPostData, response);
        logger.info("Nouveau post créé avec succès");
        APIResponse(response, newPost, "Post créé avec succès", 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            logger.error("Données invalides : " + error.errors.map(e => e.message).join(", "));
            APIResponse(response, null, "Données invalides : " + error.errors.map(e => e.message).join(", "), 400);
        } else {
            logger.error("Erreur lors de la création du post: " + error.message);
            APIResponse(response, null, "Erreur lors de la création du post", 500);
        }
    }
};

//Controller pour supprimer un post en fonction de son ID
export const deletePostById = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        const authorId = new Types.ObjectId(request.params.authorId);

        logger.info(`[DELETE] /posts/${postId}/${authorId}- Suppression du post par l'utilisateur`);

        const deletedPost = await Model.posts.delete(postId, authorId, response);
        
        if (!deletedPost) {
            return APIResponse(response, null, "Post non trouvé ou non autorisé", 404);
        }

        logger.info("Post supprimé avec succès");
        return APIResponse(response, "Post supprimé avec succès", "success", 200);
    } catch (error : any){
        logger.error("Erreur lors de la recherche de l'utilisateur:", error.message);
        APIResponse(response, null, "Erreur lors de la suppression du post", 500);
    }
};

// Controller pour mettre à jour un post
export const updatePost = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        logger.info(`[PUT] /posts/${id} - Mise à jour de l'utilisateur`);
        const post = request.body;

        await Model.posts.update(new Types.ObjectId(id), post, response);

        logger.info("Post mis à jour");
        return APIResponse(response, "Post mis à jour avec succès", "success", 200);
    } catch (error: any){
        logger.error("Erreur lors de la mise à jour du post :", error.message);
        APIResponse(response, null, "Erreur lors de la mise à jour du post", 500);
    }
};

// Controller pour récupérer tous les posts d'un utilisateur spécifique
export const getPostsByAuthorId = async (request: Request, response: Response) => {
    try {
        const { authorId } = request.params;
        logger.info(`[GET] /posts/user/${authorId} - Récupération du post via son authorId: ${authorId}`);

        if (!authorId || authorId === 'undefined') {
            logger.warn("ID d'utilisateur manquant ou invalide");
            return APIResponse(response, null, "ID d'utilisateur manquant ou invalide", 400);
        }

        if (!Types.ObjectId.isValid(authorId)) {
            logger.warn("ID d'utilisateur invalide");
            return APIResponse(response, null, "ID d'utilisateur invalide", 400);
        }

        const objectIdUserId = new Types.ObjectId(authorId);
        logger.info("ID d'utilisateur transformé en ObjectId: " + objectIdUserId);

        const posts = await Model.posts.findByAuthor(objectIdUserId);
        logger.info("Posts trouvés: " + posts!.length);

        if (!posts || posts.length === 0) {
            logger.warn("Aucun post trouvé pour cet utilisateur");
            return APIResponse(response, [], "Aucun post trouvé pour cet utilisateur", 200);
        }

        logger.info("Posts récupérés avec succès");
        return APIResponse(response, posts, "Posts récupérés avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des posts de l'utilisateur: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des posts de l'utilisateur", 500);
    }
};