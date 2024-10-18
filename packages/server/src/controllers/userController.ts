import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { hashPassword, verifyPassword, APIResponse, logger, generateAccessToken, generateRefreshToken } from "../utils";
import { userValidation } from "../validation/validation";
import Model from "../models/index";
import { env } from "../config/env";

const { JWT_SECRET, NODE_ENV } = env;


//We retrieve all users
export const getUsers = async (request: Request, response: Response) => {
    try {
        const users = await Model.users.get(response);
        
        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        APIResponse(response, null, "Erreur lors de la récupération de la liste des utilisateurs", 500);
    }
};

//We retrieve an user by its id
export const getUsersById = async (request: Request, response: Response) => {
    try {
        const id = new Types.ObjectId(request.params.id);
        const result = await Model.users.where(id, response);

        if (result) {
            response.status(200).json({ data: result.user });
        } else {
            response.status(404).json({ message: "Utilisateur non trouvé" });
        }
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
        const emailExist = await Model.users.findWithCredentials(validatedData.email);

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

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            APIResponse(response, null, "Erreur lors de la création de l'utilisateur", 500);
    }
};

//Méthode pour la connexion de l'user avec un JWT
export const login = async (req: Request, res: Response) => {
    try {
        logger.info("[POST] /login - Tentative de connexion");

        const { email, password } = req.body;

        const user = await Model.users.findWithCredentials(email);

        if (!user) {
            logger.warn("Échec de connexion: cet utilisateur n'existe pas");
            return APIResponse(res, null, "Cet utilisateur n'existe pas", 401);
        }

        if(!(await verifyPassword(password, user.password))){
            logger.warn("Échec de connexion : mot de passe incorrect");
            return APIResponse(res, null, "Mot de passe incorrect", 401);
        }

        // On génère un token et un refresh token
        const accessToken = generateAccessToken(user.role, user.id);
        const refreshToken = generateRefreshToken(user.id); 

        // On place le token dans un cookie sécurisé
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none", 
            secure: true, 
            domain: process.env.NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
            path: "/"
        });

        // On place le refreshtoken dans un cookie sécurisé
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none", 
            secure: true, 
            domain: process.env.NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
            path: "/"
        });

        //On crée un nouvel objet à partir de l'objet user en écrasant la propriété password et en lui assignant la valeur undefined
        const userWithoutPassword = { ...user.toObject(), password: undefined };

        logger.info("Utilisateur connecté");
        return APIResponse(res,{ accessToken, userWithoutPassword }, "Connecté avec succès", 200);
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

        return APIResponse(res, null, "Logged out", 200);
    } catch (error: any) {
        logger.error(`Erreur lors de la déconnexion: ${error.message}`);
        return APIResponse(res, error, "error", 500);
    }
};

export const deleteUserById = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;

        await Model.users.delete(new Types.ObjectId(id), response);

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error: unknown) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        APIResponse(response, error, "error", 500);
    }
};

export const updateUser = async (request: Request, response: Response) => {
    try {
        const id = request.params.id;
        const user = request.body;

        await Model.users.update(new Types.ObjectId(id), user, response);

        //Le modèle gère la réponse API. Nous retournons simplement pour terminer la fonction.
        return;
    } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
};

export const profilUser = async (request: Request, response: Response) => {
    try {
        const id = response.locals.user.id;

        await Model.users.where(id, response);

        APIResponse(response, id, "", 200);
    } catch (error: unknown) {
        console.error("Erreur lors de la récupération de l'id pour le profil :", error);
        APIResponse(response, null, "Erreur lors de la mise à jour de l'utilisateur", 500);
    }
}