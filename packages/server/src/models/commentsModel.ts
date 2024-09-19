import { Response } from "express";
import { Types } from "mongoose";

import { APIResponse } from "../utils/responseUtils";

import Comment from "../schemas/comments";

import { IComment } from "../types/IComment";

//CRUD to get all comments
export const getAllComments = async (response: Response): Promise<IComment[]> => {
    try {
        const comments = await Comment.find().select("authorId postId animalId").exec();

        APIResponse(response, comments, "Liste de tous les commentaires récupérée avec succès");
        return comments;
    } catch (error) {
        console.error(error);

        APIResponse(response, null, "Erreur lors de la récupération de la liste des commentaires", 500);
        return [];
    }
};

//CRUD to get a comment from its id
export const findCommentById = async (id: Types.ObjectId, response: Response): Promise<{ comment: IComment } | null> => {
    try {
        const comment = await Comment.findById(id).populate([
            {
                path: "authorId",
                select: "name firstName email"
            },
            {
                path: "postId",
                select: "authorId textContent photoContent comments"
            }
        ]).exec();

        if (!comment) {
            APIResponse(response, null, "Commentaire non trouvé", 404);
            return null;
        }

        const result = { comment: comment.toObject() };

        APIResponse(response, result, "Commentaire trouvé");
        return result;
    } catch (error: any) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la recherche du commentaire", 500);
        return null;
    }
};

//CRUD to create a new comment
export const createComment = async (comment: Partial<IComment>, response: Response): Promise<IComment | null> => {
    try {
        const newComment = await Comment.create(comment);

        APIResponse(response, newComment, "Commentaire ajouté avec succès", 201);
        return newComment;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de l'ajout du commentaire", 500);
        return null;
    }
};

//CRUD to delete a comment by its id
export const deleteComment = async (id: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<IComment | null> => {
    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: id, authorId });

        if (!deletedComment) {
            APIResponse(response, null, "Commentaire non trouvé ou vous n'êtes pas autorisé à le supprimer", 404);
            return null;
        }

        APIResponse(response, deletedComment, "Commentaire supprimé avec succès");
        return deletedComment;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la suppression du commentaire", 500);
        return null;
    }
};

//CRUD to update a comment by its id
export const updateComment = async (id: Types.ObjectId, authorId: Types.ObjectId, commentData: Partial<IComment>, response: Response): Promise<IComment | null> => {
    try {
        const updateComment = await Comment.findOneAndUpdate(
            { _id: id, authorId },
            commentData,
            { new: true }
        ).exec();

        if (!updateComment) {
            APIResponse(response, null, "Commentaire non trouvé ou vous n'êtes pas autorisé à le modifier", 404);
            return null;
        }

        APIResponse(response, updateComment, "Commentaire mis à jour avec succès");
        return updateComment;
    } catch (error) {
        console.error(error);
        APIResponse(response, null, "Erreur lors de la mise à jour du commentaire", 500);
        return null;
    }
};


//CRUD to get all comments by their user ID
export const findCommentsByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<IComment[] | null> => {
    try {
        const comments = await Comment.find({ authorId }).exec();

        if (comments.length === 0) {
            APIResponse(response, null, "Aucun commentaire trouvé pour cet utilisateur", 404);
            return null;
        }
        APIResponse(response, comments, "Commentaires trouvés pour cet utilisateur");
        return comments;
    } catch (error) {
        console.error("Erreur lors de la recherche des commentaires par utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la recherche des commentaires de l'utilisateur", 500);
        return null;
    }
};

//CRUD to get all comments by a post ID
export const findCommentsByPostId = async (postId: Types.ObjectId, response: Response): Promise<IComment[] | null> => {
    try {
        const comments = await Comment.find({ postId }).exec();

        if (comments.length === 0) {
            APIResponse(response, null, "Aucun commentaire trouvé pour ce post", 404);
            return null;
        }
        APIResponse(response, comments, "Commentaires trouvés pour ce post");
        return comments;
    } catch (error) {
        console.error("Erreur lors de la recherche des commentaires par post :", error);
        APIResponse(response, null, "Erreur lors de la recherche des commentaires du post", 500);
        return null;
    }
};