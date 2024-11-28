import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";

import { env } from "../config/env";
import { APIResponse, verifyRefreshToken, logger } from "../utils";
import Model from "../models/index";

//const { JWT_SECRET, NODE_ENV } = env;
const isProduction = process.env.NODE_ENV === 'production';

const { JWT_SECRET, JWT_EXPIRATION_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_SECRET } = env;

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
    logger.debug("Cookie raw:", req.headers.cookie);

    const cookies = req.headers.cookie ? 
        Object.fromEntries(
            req.headers.cookie.split('; ').map(cookie => {
                const [name, value] = cookie.split('=');
                return [name, decodeURIComponent(value)];
            })
        ) 
        : {};

    logger.debug("Cookies parsés manuellement:", JSON.stringify(cookies, null, 2));

    const accessToken = cookies.accessToken || req.cookies.accessToken;
    const refreshToken = cookies.refreshToken || req.cookies.refreshToken;

    logger.debug("Cookies parsés:", { accessToken, refreshToken });

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
            // const newAccessToken = createAccessToken(userIdString);
            // const newRefreshToken = createRefreshToken(userIdString);

            const newAccessToken = jwt.sign({ userIdString }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_SECRET});
        const newRefreshToken = jwt.sign({ userIdString }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_SECRET});

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