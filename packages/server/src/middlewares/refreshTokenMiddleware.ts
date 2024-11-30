import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../schemas/users";

import { env } from "../config/env";
import { APIResponse, createAccessToken, createRefreshToken, logger } from "../utils";
import Model from "../models/index";

const { REFRESH_TOKEN_SECRET } = env;

// export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     logger.info("refreshTokenMiddleware appelé");
//     logger.debug("Headers complets:", JSON.stringify(req.headers, null, 2));
//     logger.debug("Cookie raw:", req.headers.cookie);

//     const cookies = req.headers.cookie ? 
//         Object.fromEntries(
//             req.headers.cookie.split('; ').map(cookie => {
//                 const [name, value] = cookie.split('=');
//                 return [name, decodeURIComponent(value)];
//             })
//         ) 
//         : {};

//     logger.debug("Cookies parsés manuellement:", JSON.stringify(cookies, null, 2));

//     const accessToken = cookies.accessToken || req.cookies.accessToken;
//     const refreshToken = cookies.refreshToken || req.cookies.refreshToken;

//     logger.debug("Cookies parsés:", { accessToken, refreshToken });

//     if (!accessToken || !refreshToken) {
//         logger.warn("Tokens manquants", { accessToken, refreshToken });
//         res.clearCookie("accessToken", {
//             httpOnly: true,
//             sameSite: 'none',
//             secure: true,
//             path: '/'
//         });
//         res.clearCookie("refreshToken", {
//             httpOnly: true,
//             sameSite: 'none',
//             secure: true,
//             path: '/'
//         });
//         return next();
//     }

//     try {
//         jwt.verify(accessToken, JWT_SECRET);
//         return next();
//     } catch (error) {
//         // Récupération et conversion de l'userId
//         const userIdString = verifyRefreshToken(refreshToken);
//         if (!userIdString) {
//             res.clearCookie("accessToken");
//             res.clearCookie("refreshToken");
//             return APIResponse(res, null, "Invalid Refresh Token.", 403);
//         }

//         // Conversion en ObjectId avec vérification
//         const userId = toObjectId(userIdString);
//         if (!userId) {
//             res.clearCookie("accessToken");
//             res.clearCookie("refreshToken");
//             return APIResponse(res, null, "Invalid User ID format.", 403);
//         }

//         try {
//             // Utilisation de l'ObjectId pour les requêtes
//             const user = await Model.users.where(userId, res);
            
//             if (!user || user.user.refreshToken !== refreshToken) {
//                 res.clearCookie("accessToken");
//                 res.clearCookie("refreshToken");
//                 return APIResponse(res, null, "Invalid Refresh Token.", 403);
//             }

//             // On crée des nouveaux tokens 
//             const newAccessToken = createAccessToken(userIdString);
//             const newRefreshToken = createRefreshToken(userIdString);

//             // On met à jour le refreshToken en base
//             await Model.users.update(userId, { refreshToken: newRefreshToken }, res);

//             //On met à jour les cookies
//             res.cookie("accessToken", newAccessToken, {
//                 httpOnly: true,
//                 sameSite: "none",
//                 secure: true,
//                 path: "/",
//                 maxAge: 72 * 60 * 60 * 1000
//             });
        
//             res.cookie("refreshToken", newRefreshToken, {
//                 httpOnly: true,
//                 sameSite: "none",
//                 secure: true,
//                 path: "/",
//                 maxAge: 7 * 24 * 60 * 60 * 1000
//             });

//             logger.debug("newRefreshToken :", newRefreshToken);
//             logger.debug("newAccessToken :", newAccessToken);

//             next();
//         } catch (error) {
//             res.clearCookie("accessToken");
//             res.clearCookie("refreshToken");
//             return APIResponse(res, null, "Error processing refresh token.", 500);
//         }
//     }
// };

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log('Refresh Token Middleware:', { accessToken, refreshToken });

    if (!refreshToken) {
        console.log('Pas de refresh token');
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return APIResponse(res, null, "Invalid Refresh Token.", 403);
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string };
        const userId = new Types.ObjectId(decoded.id);

        const user = await User.findById(userId).select('+refreshToken');
        console.log("User:", user);

        console.log("Token reçu:", refreshToken);
        console.log("Token en base:", user?.refreshToken);
        
        if (!user || user.refreshToken !== refreshToken) {
            console.log('Token invalide');
            return next();
        }

        const newAccessToken = createAccessToken(user.id);
        const newRefreshToken = createRefreshToken(user.id);

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: true,
            path: "/",
            maxAge: 72 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Mettre à jour le refresh token en base
        await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken }, res);

        next();
    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return APIResponse(res, null, "Error processing refresh token.", 500);
    }
};