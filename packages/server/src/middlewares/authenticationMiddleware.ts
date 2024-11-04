import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import Model from "../models/index";
import jwt from "jsonwebtoken"
import { APIResponse } from "../utils/responseUtils";
const { JWT_SECRET } = env;


export const authenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    console.log("Middleware d'authentification appelé");
    console.log("Tous les cookies reçus:", request.cookies);

    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token){
        console.log("Pas de token trouvé dans les cookies");
        return APIResponse(response, null, "Pas de token", 401);
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Token décodé:", decoded);
        response.locals.user = decoded;
        next();
    } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    }
}

export const isAdmin = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return APIResponse(response, null, "Access denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        const userId = new mongoose.Types.ObjectId(decoded.id);
        const result = await Model.users.where(userId, response);

        if (!result || !result.user) {
            return APIResponse(response, null, "User not found.", 404);
        }

        if (result.user.role !== 'ADMIN') {
            return APIResponse(response, null, "Access denied. You are not an admin.", 403);
        }

        response.locals.user = result.user;
        next();
    } catch (error) {
        console.error("Erreur de vérification:", error);
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
