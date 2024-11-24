import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";

import { env } from "../config/env";
import { APIResponse, verifyRefreshToken, createAccessToken, createRefreshToken } from "../utils";
import Model from "../models/index";

const { JWT_SECRET, NODE_ENV } = env;

// Fonction utilitaire pour convertir string en ObjectId
const toObjectId = (id: string): Types.ObjectId | null => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        return null;
    }
};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return next();
    }

    try {
        jwt.verify(accessToken, JWT_SECRET);
        return next();
    } catch (error) {
        // Récupération et conversion de l'userId
        const userIdString = verifyRefreshToken(refreshToken);
        if (!userIdString) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return APIResponse(res, null, "Invalid Refresh Token.", 403);
        }

        // Conversion en ObjectId avec vérification
        const userId = toObjectId(userIdString);
        if (!userId) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return APIResponse(res, null, "Invalid User ID format.", 403);
        }

        try {
            // Utilisation de l'ObjectId pour les requêtes
            const user = await Model.users.where(userId, res);
            
            if (!user || user.user.refreshToken !== refreshToken) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return APIResponse(res, null, "Invalid Refresh Token.", 403);
            }

            // On crée des nouveaux tokens 
            const newAccessToken = createAccessToken(userIdString);
            const newRefreshToken = createRefreshToken(userIdString);

            // On met à jour le refreshToken en base
            await Model.users.update(userId, { refreshToken: newRefreshToken }, res);

            //On met à jour les cookies
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: NODE_ENV === "production",
                sameSite: "strict"
            });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: NODE_ENV === "production",
                sameSite: "strict"
            });

            next();
        } catch (error) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return APIResponse(res, null, "Error processing refresh token.", 500);
        }
    }
};