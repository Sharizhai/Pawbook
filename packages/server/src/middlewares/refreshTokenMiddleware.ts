import { NextFunction, Request, Response, CookieOptions  } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Types } from "mongoose";
import { APIResponse, verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils";
import Model from "../models/index";

const { JWT_SECRET, REFRESH_JWT_SECRET, NODE_ENV } = env;

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //We retrieve access token and refresh token
    const { accessToken, refreshToken } = req.cookies;

    // If one of the tokens is missing, we clear the cookies and move on to the next middleware.
    if (!accessToken || !refreshToken) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
            path: "/"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
            path: "/"
        });
        return next();
    }

    try {
        // Check the validity of the accessToken
        jwt.verify(accessToken, JWT_SECRET);
        return next();
    } catch (err) {
        // If the access token has expired, we check refreshToken
        const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as { userId: string };
        const userId = decoded.userId;

        //If refreshToken is invalid, we delete existing cookies
        if (!userId) {
            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
                path: "/"
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
                path: "/"
            });
            return APIResponse(res, null, "Session expirée", 401);
        }

        try {
            // Converting userId to ObjectId
            const objectId = new Types.ObjectId(userId);
    
            // Recovery of user data via its ID
            const userData = await Model.users.where(objectId, res);
            
            if (!userData || !userData.user || userData.user.refreshToken !== refreshToken) {
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
                    path: "/"
                });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
                    path: "/"
                });
                return APIResponse(res, null, "Session invalide", 401);
            }

            // Generating new tokens
            const newAccessToken = generateAccessToken(userData.user.role, userId);
            const newRefreshToken = generateRefreshToken(userId);

            // updata token in base
            await Model.users.update(
                objectId,
                { refreshToken: newRefreshToken },
                res
            );

            // cookie configuration
            const cookieOptions : CookieOptions  = {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                domain: NODE_ENV === 'production' ? "pawbook-production.up.railway.app" : undefined,
                path: "/"
            };
            
            res.cookie("accessToken", newAccessToken, cookieOptions);
            res.cookie("refreshToken", newRefreshToken, cookieOptions);

            next();
        } catch (error) {
            console.error("Erreur lors du refresh du token:", error);
            return APIResponse(res, null, "Erreur lors du refresh du token", 500);
        }
    }
};