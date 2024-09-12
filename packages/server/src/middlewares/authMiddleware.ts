import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken"
import { APIResponse } from "../utils/response";
const { JWT_SECRET } = env;


export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies.token;
    if (!token)
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        response.locals.user = decoded;
        next();
    } catch (error) {
        return APIResponse(response, null, "Vous n'êtes pas authentifié", 401);
    }
}

export const isAdmin = (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies.token;

    if (!token) {
        return APIResponse(response, null, "Access denied. No token provided.", 401);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

        if (decoded.role !== 'admin') {
            return APIResponse(response, null, "Access denied. You are not an admin.", 403);
        }

        next();
    } catch (error) {
        return APIResponse(response, null, "Invalid or expired token.", 401);
    }
};
