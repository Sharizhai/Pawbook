import { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";
import { commentValidation } from "../validation/validation";

// Controller pour récupérer tous les commentaires
export const getComments = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /comments - Récupération de tous les commentaires");
        const comments = await Model.comments.get(response);

        logger.info("Liste de tous les commentaires récupérée avec succès");
        APIResponse(response, comments, "Liste de tous les commentaires récupérée avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des commentaires", 500);
    }
};

// Controller pour récupérer un commentaire par son id
export const getCommentById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /comments/${id} - Récupération du commentaire via son ID`);

        const comment = await Model.comments.where(id, response);
        
        if (comment) {
            logger.info("Commentaire récupéré avec succès");
            APIResponse(response, comment, "Commentaire récupéré avec succès", 200);
        } else {
            logger.warn("Commentaire non trouvé");
            APIResponse(response, null, "Commentaire non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la recherche du commentaire: " + error.message);
        APIResponse(response, null, "Erreur lors de la recherche du commentaire", 500);
    }
};

// Controller pour créer un nouveau commentaire
export const createAComment = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /comments/register - Création d'un nouveau commentaire");
        const commentData = request.body;

        const validatedData = commentValidation.parse(commentData);

        const newCommentData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            postId: new Types.ObjectId(validatedData.postId),
            textContent: validatedData.textContent
        }

        const newComment = await Model.comments.create(newCommentData, response);

        logger.info("Nouveau commentaire créé avec succès");
        return APIResponse(response, newComment, "Commentaire créé avec succès", 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            logger.error("Données invalides : " + error.errors.map(e => e.message).join(", "));
            APIResponse(response, null, "Données invalides : " + error.errors.map(e => e.message).join(", "), 400);
        } else {
            logger.error("Erreur lors de la création du commentaire: " + error.message);
            APIResponse(response, null, "Erreur lors de la création du commentaire", 500);
        }
    }
};

// Controller pour supprimer un commentaire par son id
export const deleteCommentById = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        const authorId = new Types.ObjectId(request.params.authorId);

        logger.info(`[DELETE] /comments/${postId}/${authorId} - Suppression d'un like par postId et authorId`);

        const deletedComment = await Model.comments.delete(postId, authorId, response);
        
        if (deletedComment) {
            logger.info("Commentaire supprimé avec succès");
            APIResponse(response, deletedComment, "Commentaire supprimé avec succès", 200);
        } else {
            logger.warn("Commentaire non trouvé");
            APIResponse(response, null, "Commentaire non trouvé", 404);
        }
    } catch (error: any) {
        logger.error("Erreur lors de la suppression du commentaire : " + error.message);
        APIResponse(response, null, "Erreur lors de la suppression du commentaire", 500);
    }
};

// Controller pour mettre à jour un commentaire
export const updateComment = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const authorId = new Types.ObjectId(request.params.authorId); 
        logger.info(`[PUT] /comments/${id} - Mise à jour du commentaire`);
        
        const commentData = request.body;
        
        const validatedData = commentValidation.parse(commentData);

        const newCommentData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            postId: new Types.ObjectId(validatedData.postId),
            textContent: validatedData.textContent
        }

        const newComment = await Model.comments.update(id, authorId, newCommentData, response);
        
        logger.info("Utilisateur mis à jour avec succès");
        APIResponse(response, newComment, "Utilisateur mis à jour avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la mise à jour du commentaire : " + error.message);
        APIResponse(response, null, "Erreur lors de la mise à jour du commentaire", 500);
    }
};

// Controller pour récupérer les commentaires d'un utilisateur spécifique
export const getCommentsByAuthorId = async (request: Request, response: Response) => {
    try {
        const { authorId } = request.params;
        logger.info(`[GET] /comments/user/${authorId} - Récupération du post via son authorId: ${authorId}`);

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

        const comments = await Model.comments.findByAuthor(objectIdUserId, response);
        logger.info("Commentaires trouvés: " + comments!.length);
        
        if (!comments || comments.length === 0) {
            logger.warn("Aucun commentaire trouvé pour cet utilisateur");
            return APIResponse(response, [], "Aucun commentaire trouvé pour cet utilisateur", 404);
        }

        logger.info("Commentaires récupérés avec succès");
        return APIResponse(response, comments, "Commentaires récupérés avec succès", 200);
    } catch (error: any) {
        logger.error("Erreur lors de la récupération des commentaires de l'utilisateur: " + error.message);
        APIResponse(response, null, "Erreur lors de la récupération des commentaires de l'utilisateur", 500);
    }
};

// Controller pour récupérer les commentaires d'un post spécifique
export const getCommentsByPostId = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        logger.info(`[GET] /comments/${postId} - Récupération des commentaires par postId`);

        const comments = await Model.comments.findByPost(postId, response);
        
        if (!comments || comments.length === 0) {
            logger.warn("Aucun commentaire trouvé pour ce post");
            return APIResponse(response, [], "Aucun commentaire trouvé pour ce post", 404);
        }

        logger.info("Commentaires récupérés avec succès");
        return APIResponse(response, comments, "Commentaires récupérés avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires du post:", error);
        APIResponse(response, null, "Erreur lors de la récupération des commentaires du post", 500);
    }
};