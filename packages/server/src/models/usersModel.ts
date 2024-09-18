import { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { APIResponse } from "../utils/responseUtils";

import User from "../schemas/users";
import userCredential from "../schemas/userCredential";

import { IUser } from "../types/IUser";
import { IUserCredential } from "../types/IUserCredential";

//CRUD to get all users
export const getAllUsers = async (response: Response): Promise<IUser[]> => {
  try {
    const users = await User.find().select("name firstName email").exec();

    APIResponse(response, users, "Liste de tous les utilisateurs récupérée avec succès");
    return users;
  } catch (error) {
    console.error(error);

    APIResponse(response, null, "Erreur lors de la récupération de la liste des utilisateurs", 500);
    return [];
  }
};

//CRUD to get a user from it's id
export const findUserById = async (id: Types.ObjectId, response: Response): Promise<{ user: IUser } | null> => {
  try {
    const user = await User.findById(id).select("name firstName email").exec();

    if (!user) {
      APIResponse(response, null, "Utilisateur non trouvé", 404);
      return null;
    }

    const result = { user: user.toObject() };

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
export const deleteUser = async (id: Types.ObjectId, response: Response): Promise<IUser | null> => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      APIResponse(response, null, "Utilisateur non trouvé ou vous n'êtes pas autorisé à le supprimer", 404);
      return null;
    }

    APIResponse(response, deletedUser, "Utilisateur supprimé avec succès");
    return deletedUser;
  } catch (error) {
    console.error(error);
    APIResponse(response, null, "Erreur lors de la suppression de l'utilisateur", 500);
    return null;
  }
};

//CRUD to update a user by it's id
export const updateUser = async (id: Types.ObjectId, userData: Partial<IUser>, response: Response): Promise<IUser | null> => {
  try {
      const updatedUser = await User.findOneAndUpdate(
          { _id: id },
          userData,
          { new: true }
      ).exec();

      if (!updatedUser) {
          APIResponse(response, null, "Utilisateur non trouvé ou vous n'êtes pas autorisé à le modifier", 404);
          return null;
      }

      APIResponse(response, updatedUser, "Utilisateur mis à jour avec succès");
      return updatedUser;
  } catch (error) {
      console.error(error);
      APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
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