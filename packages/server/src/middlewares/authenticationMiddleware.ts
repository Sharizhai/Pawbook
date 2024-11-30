import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import User from "../schemas/users";
import jwt from "jsonwebtoken"
import { APIResponse, logger } from "../utils";
const { JWT_SECRET } = env;


// export const authenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
//     logger.info("Middleware d'authentication appelé");
//     logger.debug("Cookies reçus:", request.cookies);

//     const accessToken = request.cookies.accessToken;

//     if(!accessToken){
//         logger.warn("Pas de token d'accès trouvé dans les cookies");
//         return APIResponse(response, null, "Authentification requise", 401);
//     }

//     try {
//         // On vérifie le token d'accès trouvé
//         const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
//         logger.debug("Token décodé:", decoded);
        
//         // On stocke les informations de l'utilisateur pour une utilisation ultérieure
//         response.locals.user = { id: decoded.userId };
//         next();
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             logger.warn("Token expiré");
//             return APIResponse(response, null, "Token expiré", 401);
//         }

//         logger.error("Erreur lors de la vérification du token:", error);
//         return APIResponse(response, null, "Token invalide", 401);
//     }
// }

export const authenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    logger.info("Middleware d'authentification appelé");
    
    const accessToken = request.cookies.accessToken;
    
    if (!accessToken) {
        logger.warn("Pas de token trouvé dans les cookies");
        return APIResponse(response, null, "Pas de token", 401);
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        logger.debug("Token décodé:", decoded);
        response.locals.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn("Token expiré");
            return APIResponse(response, null, "Token expiré", 401);
        }
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    }
};

export const isAdmin = async (request: Request, response: Response, next: NextFunction) => {
    logger.info("Middleware isAdmin appelé");
    logger.debug("Cookies reçus:", request.cookies);

    const accessToken = request.cookies.accessToken;
    
    if(!accessToken) {
        logger.warn("Pas de token d'accès trouvé dans les cookies");
        return APIResponse(response, null, "Access denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as { id: string };

        logger.debug("Token décodé:", decoded);

        const userId = new mongoose.Types.ObjectId(decoded.id);
        const user = await User.findById(userId);

        if (!user) {
            logger.warn("Utilisateur non trouvé pour l'ID:", userId);
            return APIResponse(response, null, "User not found.", 404);
        }

        if (user.role !== 'ADMIN') {
            logger.warn(`Accès refusé. Rôle utilisateur: ${user.role}`);
            return APIResponse(response, null, "Access denied. You are not an admin.", 403);
        }

        logger.info("Accès administrateur autorisé");
        response.locals.user = user;
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