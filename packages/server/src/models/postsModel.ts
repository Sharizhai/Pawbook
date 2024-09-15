import { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";

import Post from "../schemas/posts";

import { IPost } from "../types/IPost";

//CRUD to get all posts
export const getAllPosts = async (response: Response): Promise<IPost[]> => {
    try {
      const posts = await Post.find().select("name firstName email").exec();

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
        APIResponse(response, null, "Utilisateur non trouvé", 404);
        return null;
      }

      const result = { post: post.toObject() };

      APIResponse(response, result, "Utilisateur trouvé");
      return result;
    } catch (error: any) {
      console.error(error);
      APIResponse(response, null, "Erreur lors de la recherche de l'utilisateur", 500);
      return null;
    }
  };

//CRUD to create a new user
export const createUser = async (user: Partial<IUser>, response: Response): Promise<IUser | null> => {
    try {
        const newUser = await User.create(user);

        APIResponse(response, newUser, "Utilisateur créé avec succès", 201);
      return newUser;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données utilisateur invalides", 400);
          } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de la création de l'utilisateur", 500);
          }
          return null;
    }
};

//CRUD to delete a user by it's id
export const deleteUser = async (id: Types.ObjectId, response: Response): Promise<{ deletedCount: number }> => {
    try {
      const result = await User.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        APIResponse(response, null, "Utilisateur non trouvé", 404);
      } else {
        APIResponse(response, result, "Utilisateur supprimé avec succès");
      }
      return result;
    } catch (error: any) {
      console.error(error);
      APIResponse(response, null, "Erreur lors de la suppression de l'utilisateur", 500);
      return { deletedCount: 0 };
    }
  };

//CRUD to update a user by it's id
export const updateUser = async (id: Types.ObjectId, userData: Partial<IUser>, response: Response): Promise<IUser | null> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true }).exec();

        if (!updatedUser) {
            APIResponse(response, null, "Utilisateur non trouvé", 404);
            return null;
          }
          APIResponse(response, updatedUser, "Utilisateur mis à jour avec succès");
          return updatedUser;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            APIResponse(response, error.errors, "Données invalides", 400);
          } else {
            console.error(error);
            APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
          }
          return null;
    }
};


//CRUD to get a user by it's credentials

// On fait d'abord un schéma Zod pour la validation de l'email
const EmailSchema = z.string().email();

export const findByCredentials = async (email: string): Promise<IUserCredential | null> => {
    try {
        // On valide l'email avec zod
        const validatedEmail = EmailSchema.parse(email);

        const user = await userCredential.findOne({ email: validatedEmail })
            .select("email password")
            .exec();

        if (!user) {
            console.log("Utilisateur non trouvé avec cet email");
            return null;
        }
        return user;

    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error("Email validation failed:", err.errors);
        } else {
            console.error("Error in findByCredentials:", err);
        }
        return null;
    }
};