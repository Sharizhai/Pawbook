import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { hashPassword, verifyPassword } from "../utils/passwordUtils";
import { userValidation } from "../validation/validation";
import { APIResponse } from "../utils/responseUtils";
import Model from "../models/index";
import { env } from "../config/env";

const { JWT_SECRET, NODE_ENV } = env;


//On récupère tous les users
export const getUsers = async (response: Response) => {
    try {
        const users = await Model.users.get(response);
        APIResponse(response, users, "Liste de tous les utilisateurs récupérée avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des utilisateurs", 500);
    }
};

//On récupère un user par son id
export const getUsersById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const user = await Model.users.where(id, response);

        if (!user)
            return APIResponse(response, null, "Utilisateur non trouvé", 404);

        APIResponse(response, user, "Utilisateur trouvé", 200);
    } catch (error) {
        console.error("Erreur lors de la recherche de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la recherche de l'utilisateur", 500);
    }
};

//On crée un nouvel user (inscription)
export const createAUser = async (request: Request, response: Response) => {
    try {
        const userData = request.body;

        // Valide les données utilisateur avec le schéma Zod fourni afin de s'assure que les données soient valides
        const validatedData = userValidation.parse(userData);

        // On vérifie si l'e-mail existe déjà en base
        const emailExist = await Model.users.findByCredentials(validatedData.email);

        if (emailExist) {
            return APIResponse(response, null, "Email déjà existant", 409);
        }

        // On hash le mot de passe
        const hashedPassword = await hashPassword(validatedData.password);
        if (!hashedPassword) {
            throw new Error("Erreur lors du hashage du mot de passe");
        }

        // On crée le nouvel utilisateur 
        const newUserData = {
            name: validatedData.name,
            firstName: validatedData.firstName,
            email: validatedData.email,
            password: hashedPassword,
            role: validatedData.role,
            profilePicture: validatedData.profilePicture,
            profileDescription: validatedData.profileDescription,
        };

        //Le nouvel user est ajouté à la base de données
        const newUser = await Model.users.create(newUserData, response);

        APIResponse(response, newUser, "Utilisateur créé avec succès", 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            APIResponse(response, errorMessages, "Données utilisateur invalides", 400);
        } else {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            APIResponse(response, null, "Erreur lors de la création de l'utilisateur", 500);
        }
    }
};

//Méthode pour la connexion de l'user avec un JWT
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await Model.users.findByCredentials(email);

        if (!user || !(await verifyPassword(password, user.password))) {
            return APIResponse(res, null, "Email ou mot de passe incorrect", 401);
        }

        // On génère un token JWT avec une expiration d'une heure
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        // On place le token dans un cookie sécurisé
        res.cookie("token", token, {
            httpOnly: true, // Le cookie n'est pas accessible via JavaScript
            sameSite: "strict", // On prévient les attaques CSRF(Cross-Site Request Forgery)
            secure: NODE_ENV === "production", // Le cookie n'est sécurisé que dans un environnement de production
        });

        //On crée un nouvel objet à partir de l'objet user en écrasant la propriété password et en lui assignant la valeur undefined
        const userWithoutPassword = { ...user.toObject(), password: undefined };

        return APIResponse(res, userWithoutPassword, "Connecté avec succès", 200);
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return APIResponse(res, null, "Erreur lors de la connexion", 500);
    }
};

//Méthode pour la déconnexion
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        return APIResponse(res, null, "Logged out", 200);
    } catch (error) {
        return APIResponse(res, error, "error", 500);
    }
};

export const deleteUserById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;

        await Model.users.delete(new Types.ObjectId(id), response);

        APIResponse(response, null, "User deleted", 204);
    } catch (error: unknown) {
        APIResponse(response, error, "error", 500);
    }
};

export const updateUser = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const user = request.body;

        await Model.users.update(new Types.ObjectId(id), user, response);

        APIResponse(response, user, "User updated", 200);
    } catch (error: unknown) {
        APIResponse(response, error, "error", 500);
    }
};