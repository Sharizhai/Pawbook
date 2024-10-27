import { Request, Response } from "express";
import { Types } from "mongoose";
import { APIResponse, logger } from "../utils";
import Model from "../models/index";
import { commentValidation } from "../validation/validation";

// Controller pour récupérer tous les commentaires
export const getComments = async (request: Request, response: Response) => {
    try {
        const comments = await Model.comments.get(response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des commentaires", 500);
    }
};

// Controller pour récupérer un commentaire par son id
export const getCommentById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        await Model.comments.where(id, response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la recherche du commentaire :", error);
        APIResponse(response, null, "Erreur lors de la recherche du commentaire", 500);
    }
};

// Controller pour créer un nouveau commentaire
export const createAComment = async (request: Request, response: Response) => {
    try {
        const commentData = request.body;
        const validatedData = commentValidation.parse(commentData);

        const newCommentData = {
            authorId: new Types.ObjectId(validatedData.authorId),
            postId: validatedData.postId ? new Types.ObjectId(validatedData.postId) : undefined
        }

        const newComment = await Model.comments.create(newCommentData, response);

        return APIResponse(response, newComment, "Commentaire créé avec succès", 201);
    } catch (error) {
        console.error("Erreur lors de la création du commentaire :", error);
        APIResponse(response, null, "Erreur lors de la création du commentaire", 500);
    }
};

// Controller pour supprimer un commentaire par son id
export const deleteCommentById = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        const authorId = new Types.ObjectId(request.params.authorId);

        const deletedComment = await Model.comments.delete(postId, authorId, response);
        
        if (!deletedComment) {
            return APIResponse(response, null, "Commentaire non trouvé", 404);
        }
        
        return APIResponse(response, deletedComment, "Commentaire supprimé avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire :", error);
        APIResponse(response, null, "Erreur lors de la suppression du commentaire", 500);
    }
};

// Controller pour mettre à jour un commentaire
export const updateComment = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        logger.info(`[PUT] /comments/${id} - Mise à jour du commentaire`);
        const commentData = request.body;
        await Model.comments.update(new Types.ObjectId(id), commentData, response);
        
        logger.info("Post mis à jour");
        return APIResponse(response, "Commentaire mis à jour avec succès", "success", 200);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du commentaire :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour du commentaire", 500);
    }
};

// Controller pour récupérer les commentaires d'un utilisateur spécifique
export const getCommentsByAuthorId = async (request: Request, response: Response) => {
    try {
        const authorId = new Types.ObjectId(request.params.userId);
        await Model.comments.findByAuthor(authorId, response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la récupération des commentaires de l'utilisateur", 500);
    }
};

// Controller pour récupérer les commentaires d'un post spécifique
export const getCommentsByPostId = async (request: Request, response: Response) => {
    try {
        const postId = new Types.ObjectId(request.params.postId);
        await Model.comments.findByPost(postId, response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires du post:", error);
        APIResponse(response, null, "Erreur lors de la récupération des commentaires du post", 500);
    }
};