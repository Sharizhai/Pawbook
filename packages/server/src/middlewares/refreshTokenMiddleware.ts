import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";

import { env } from "../config/env";
import { APIResponse, verifyRefreshToken, createAccessToken, createRefreshToken, logger } from "../utils";
import Model from "../models/index";

const { JWT_SECRET, NODE_ENV } = env;
const isProduction = process.env.NODE_ENV === 'production';

// Fonction utilitaire pour convertir string en ObjectId
const toObjectId = (id: string): Types.ObjectId | null => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        return null;
    }
};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("refreshTokenMiddleware appelé");
    logger.debug("Headers complets:", JSON.stringify(req.headers, null, 2));
    logger.debug("Cookies bruts:", req.headers.cookie);
    logger.debug("Cookies parsés:", JSON.stringify(req.cookies, null, 2));

    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
        logger.warn("Tokens manquants", { accessToken, refreshToken });
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });
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
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 72 * 60 * 60 * 1000
            });
        
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            logger.debug("newRefreshToken :", newRefreshToken);
            logger.debug("newAccessToken :", newAccessToken);

            next();
        } catch (error) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return APIResponse(res, null, "Error processing refresh token.", 500);
        }
    }
};