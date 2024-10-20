import { Response } from "express";
import { Types } from "mongoose";

import Comment from "../schemas/comments";
import { IComment } from "../types/IComment";
import Post from "../schemas/posts";

//CRUD to get all comments
export const getAllComments = async (response: Response): Promise<IComment[]> => {
    try {
        const comments = await Comment.find().select("authorId postId animalId").exec();

        return comments;
    } catch (error) {
        console.error(error);

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
            return null;
        }

        const result = { comment: comment.toObject() };

        return result;
    } catch (error: any) {
        console.error(error);

        return null;
    }
};

//CRUD to create a new comment
export const createComment = async (comment: Promise<IComment>, response: Response): Promise<IComment | null> => {
    try {
        const newComment = await Comment.create(comment);

        await Post.findByIdAndUpdate(comment.postId, {
            $push: { comments: newComment._id } // Ajoute le like au tableau de likes du post
        });

        return newComment;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to delete a comment by its id
export const deleteComment = async (id: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<IComment | null> => {
    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: id, authorId });

        if (!deletedComment) {
            return null;
        }

        return deletedComment;
    } catch (error) {
        console.error(error);
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
            return null;
        }

        return updateComment;
    } catch (error) {
        console.error(error);

        return null;
    }
};


//CRUD to get all comments by their user ID
export const findCommentsByAuthorId = async (authorId: Types.ObjectId, response: Response): Promise<IComment[] | null> => {
    try {
        const comments = await Comment.find({ authorId }).exec();

        if (comments.length === 0) {
            return null;
        }

        return comments;
    } catch (error) {
        console.error("Erreur lors de la recherche des commentaires par utilisateur :", error);

        return null;
    }
};

//CRUD to get all comments by a post ID
export const findCommentsByPostId = async (postId: Types.ObjectId, response: Response): Promise<IComment[] | null> => {
    try {
        const comments = await Comment.find({ postId }).exec();

        if (comments.length === 0) {
            return null;
        }

        return comments;
    } catch (error) {
        console.error("Erreur lors de la recherche des commentaires par post :", error);

        return null;
    }
};