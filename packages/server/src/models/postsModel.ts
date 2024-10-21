import { Response } from "express";
import mongoose, { Types } from "mongoose";

import Post from "../schemas/posts";
import User from "../schemas/users";
import Like from "../schemas/likes";
import Comment from "../schemas/comments";

import { IPost } from "../types/IPost";

//CRUD to get all posts
export const getAllPosts = async (response: Response): Promise<IPost[]> => {
    try {
        const posts = await Post.find().select("authorId textContent photoContent comments likes").exec();

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
        }).populate({
            path: "likes",
            populate: {
                path: "authorId",
                select: "_id"
            }
        }).exec();

        if (!post) {
            return null;
        }

        console.log('Post trouvé:', post);

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

        // Met à jour l'utilisateur pour ajouter l'ID du nouveau post
        await User.findByIdAndUpdate(post.authorId, {
            $push: { posts: newPost._id } // Ajoute le post au tableau de posts de l'utilisateur
        });

        return newPost;
    } catch (error) {
        console.error(error);

        return null;
    }
};

//CRUD to delete a post by it's id
export const deletePost = async (postId: Types.ObjectId, authorId: Types.ObjectId, response: Response): Promise<IPost | null> => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Like.deleteMany({ postId: postId }).session(session);
            await Comment.deleteMany({ postId: postId }).session(session);

            await User.updateOne(
                { _id: authorId },
                { $pull: { posts: postId } },
                { session }
            );

            const deletedPost = await Post.findOneAndDelete({ _id: postId, authorId }).session(session);

            if (!deletedPost) {
                await session.abortTransaction();
                return null;
            }

            await session.commitTransaction();
            return deletedPost;
        } catch (error) {
            await session.abortTransaction();
            console.error("Erreur lors de la suppression du post:", error);
            return null;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
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
export const findPostsByAuthorId = async (authorId: Types.ObjectId): Promise<IPost[]> => {
    try {
        const user = await User.findById(authorId);
        const posts = await Post.find({ authorId: authorId._id })
            .populate({
                path: 'authorId',
                select: 'name firstName profilePicture',
            })
            .populate({
                path: 'likes',
                populate: {
                    path: 'authorId',
                    select: '_id name firstName profilePicture'
                }
            })
            .exec();
        return posts;
    } catch (error) {
        console.error("Erreur lors de la recherche des posts par utilisateur :", error);
        throw error;
    }
};