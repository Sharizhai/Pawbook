import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { hashPassword, verifyPassword, APIResponse, logger } from "../utils";
import { userValidation } from "../validation/validation";
import Model from "../models/index";
import { env } from "../config/env";

const { JWT_SECRET, NODE_ENV } = env;


//On récupère tous les users
export const getUsers = async (request: Request, response: Response) => {
    try {
        logger.info("[GET] /users - Récupération de tous les utilisateurs");
        const users = await Model.users.get(response);

        APIResponse(response, users, "Liste de tous les utilisateurs récupérée avec succès", 200);
    } catch (error : any) {
        logger.error(`Erreur lors de la récupération de la liste de tous les utilisateurs: ${error.message}`);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des utilisateurs", 500);
    }
};

//On récupère un user par son id
export const getUsersById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        logger.info(`[GET] /users/${id} - Récupération de l'utilisateur par ID`);
        const result = await Model.users.where(id, response);

        if (result) {
            logger.info("Utilisateur récupéré avec succès");
            APIResponse(response, result.user, "Utilisateur récupéré avec succès", 200);
        } else {
            logger.info("Utilisateur non trouvé");
            APIResponse(response, null, "Utilisateur non trouvé", 404);
        }
    } catch (error : any) {
        logger.error("Erreur lors de la recherche de l'utilisateur:", error.message);
        APIResponse(response, null, "Erreur lors de la recherche de l'utilisateur", 500);
    }
};

//On crée un nouvel user (inscription)
export const createAUser = async (request: Request, response: Response) => {
    try {
        logger.info("[POST] /users/register - Création d'un nouvel utilisateur");
        const userData = request.body;

        // On valide les données utilisateur avec le schéma Zod fourni afin de s'assure que les données soient bonnes
        const validatedData = userValidation.parse(userData);

        // On vérifie si l'e-mail existe déjà en base
        const emailExist = await Model.users.findWithCredentials(validatedData.email);

        if (emailExist) {
            logger.warn("Email déjà existant lors de la création de l'utilisateur");
            return APIResponse(response, null, "Email déjà existant", 409);
        }

        // On hash le mot de passe
        const hashedPassword = await hashPassword(validatedData.password);
        if (!hashedPassword) {
            logger.error("Erreur lors du hashage du mot de passe");
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
        logger.info("Nouvel utilisateur créé avec succès");
        return APIResponse(response, newUser, "Utilisateur créé avec succès", 201);
    } catch (error) {
        logger.error("Erreur lors de la création de l'utilisateur:", error);
        APIResponse(response, null, "Erreur lors de la création de l'utilisateur", 500);
    }
};

//Méthode pour la connexion de l'user avec un JWT
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        logger.info("[POST] /login - Tentative de connexion");

        const user = await Model.users.findWithCredentials(email);

        if (!user) {
            logger.warn("Échec de connexion: email incorrect");
            return APIResponse(res, null, "Cet utilisateur n'existe pas", 401);
        }

        if (!(await verifyPassword(password, user.password))) {
            logger.warn("Échec de connexion : mot de passe incorrect");
            return APIResponse(res, null, "Mot de passe incorrect", 401);
        }

        // On génère un token JWT avec une expiration d'une heure
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "72h" });
        // On place le token dans un cookie sécurisé
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("accessToken", token, {
            httpOnly: true, // Le cookie n'est pas accessible via JavaScript
            sameSite: "none",
            secure: true,
            // En production : domain = '.up.railway.app'
            // En développement : domain = undefined -> utilise automatiquement le domaine actuel
            domain: process.env.NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
            path: "/",
            maxAge: 72 * 60 * 60 * 1000
        });

        //On crée un nouvel objet à partir de l'objet user en écrasant la propriété password et en lui assignant la valeur undefined
        const userWithoutPassword = { ...user.toObject(), password: undefined };

        logger.info("Utilisateur connecté");
        return APIResponse(res, { token, userWithoutPassword }, "Connecté avec succès", 200);
    } catch (error: any) {
        logger.error(`Erreur lors de la connexion: ${error.message}`);
        return APIResponse(res, null, "Erreur lors de la connexion", 500);
    }
};

//Méthode pour la déconnexion
export const logout = async (req: Request, res: Response) => {
    try {
        logger.info("[POST] /logout - Utilisateur déconnecté");
        res.clearCookie("accessToken");

        logger.info("Utilisateur déconnecté avec succès");
        return APIResponse(res, null, "Logged out", 200);
    } catch (error: any) {
        logger.error(`Erreur lors de la déconnexion: ${error.message}`);
        return APIResponse(res, error, "error", 500);
    }
};


export const deleteUserById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        logger.info(`[DELETE] /users/${id} - Suppression de l'utilisateur par ID`);

        if (!id) {
            return APIResponse(response, "ID utilisateur manquant", "error", 400);
        }

        const deletedUser = await Model.users.delete(new Types.ObjectId(id), response);

        if (!deletedUser) {
            logger.warn("Utilisateur non trouvé lors de la suppression");
            return APIResponse(response, "Utilisateur non trouvé", "error", 404);
        }

        logger.info("Utilisateur supprimé avec succès");
        return APIResponse(response, "Utilisateur supprimé avec succès", "success", 200);
    } catch (error: unknown) {
        logger.error("Erreur lors de la suppression de l'utilisateur :", error);
        APIResponse(response, error, "error", 500);
    }
};

export const updateUser = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const user = request.body;
        logger.info(`[PUT] /users/${id} - Mise à jour de l'utilisateur`);

        await Model.users.update(new Types.ObjectId(id), user, response);
        logger.info("Utilisateur mis à jour avec succès");
        return;
    } catch (error: unknown) {
        logger.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
};

export const profilUser = async (request: Request, response: Response) => {
    try {
        const id = response.locals.user.id;
        logger.info(`[GET] /users/profile - Récupération du profil de l'utilisateur ID: ${id}`);

        await Model.users.where(id, response);

        APIResponse(response, id, "", 200);
    } catch (error: unknown) {
        logger.error("Erreur lors de la récupération de l'id pour le profil :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
}