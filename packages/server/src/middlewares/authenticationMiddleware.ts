import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import Model from "../models/index";
import jwt from "jsonwebtoken"
import { APIResponse, logger } from "../utils";
const { JWT_SECRET } = env;


export const authenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    logger.info("Middleware d'authentication appelé");
    logger.debug("Cookies reçus:", request.cookies);

    // const authHeader = request.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];

    const accessToken = request.cookies.accessToken;
    
    // if (!token){
    //     console.log("Pas de token trouvé dans les cookies");
    //     return APIResponse(response, null, "Pas de token", 401);
    // }
    // try {
    //     const decoded = jwt.verify(token, JWT_SECRET);
    //     console.log("Token décodé:", decoded);
    //     response.locals.user = decoded;
    //     next();
    // } catch (error) {
    //     console.error("Erreur lors de la vérification du token:", error);
    //     return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    // }

    if(!accessToken){
        logger.warn("Pas de token d'accès trouvé dans les cookies");
        return APIResponse(response, null, "Authentification requise", 401);
    }

    try {
        // On vérifie le token d'accès trouvé
        const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
        logger.debug("Token décodé:", decoded);
        
        // On stocke les informations de l'utilisateur pour une utilisation ultérieure
        response.locals.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn("Token expiré");
            return APIResponse(response, null, "Token expiré", 401);
        }

        logger.error("Erreur lors de la vérification du token:", error);
        return APIResponse(response, null, "Token invalide", 401);
    }
}

export const isAdmin = async (request: Request, response: Response, next: NextFunction) => {
    logger.info("Middleware isAdmin appelé");
    logger.debug("Cookies reçus:", request.cookies);

    // const authHeader = request.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];

    const accessToken = request.cookies.accessToken;

    // if (!token) {
    //     return APIResponse(response, null, "Access denied. No token provided.", 401);
    // }

    // try {
    //     const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    //     const userId = new mongoose.Types.ObjectId(decoded.id);
    //     const result = await Model.users.where(userId, response);

    //     if (!result || !result.user) {
    //         return APIResponse(response, null, "User not found.", 404);
    //     }

    //     if (result.user.role !== 'ADMIN') {
    //         return APIResponse(response, null, "Access denied. You are not an admin.", 403);
    //     }

    //     response.locals.user = result.user;
    //     next();
    // } catch (error) {
    //     console.error("Erreur de vérification:", error);
    //     return APIResponse(response, null, "Invalid token or server error.", 401);
    // }

    if(!accessToken) {
        logger.warn("Pas de token d'accès trouvé dans les cookies");
        return APIResponse(response, null, "Access denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };

        logger.debug("Token décodé:", decoded);

        const userId = new mongoose.Types.ObjectId(decoded.userId);
        const result = await Model.users.where(userId, response);

        if (!result || !result.user) {
            logger.warn("Utilisateur non trouvé pour l'ID:", userId);
            return APIResponse(response, null, "User not found.", 404);
        }

        if (result.user.role !== 'ADMIN') {
            logger.warn(`Accès refusé. Rôle utilisateur: ${result.user.role}`);
            return APIResponse(response, null, "Access denied. You are not an admin.", 403);
        }

        logger.info("Accès administrateur autorisé");
        response.locals.user = result.user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn("Token expiré");
            return APIResponse(response, null, "Token expired", 401);
        }

        logger.error("Erreur lors de la vérification du token ou de la récupération de l'utilisateur:", error);
        return APIResponse(response, null, "Invalid token or server error.", 401);
    }
};

export const authenticationMiddlewareToObject = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies.accessToken;
   
    if (!token)
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
       
        const userId = new mongoose.Types.ObjectId(decoded.id);
        
        const result = await Model.users.where(userId, response);
        
        if (!result || !result.user) {
            return APIResponse(response, null, "Utilisateur non trouvé", 401);
        }

        response.locals.user = result.user;
        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    }
};
