import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from "../utils";

export const adminRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: "Trop de requêtes. Veuillez réessayer plus tard." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        logger.warn(`Rate limit exceeded: ${req.ip} sur ${req.originalUrl}`);
        res.status(429).json({ error: "Trop de requêtes. Veuillez réessayer plus tard." });
    },
});

export const authenticationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Trop de tentatives d'authentification. Veuillez réessayer plus tard." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        logger.warn(`Rate limit exceeded: ${req.ip} sur ${req.originalUrl}`);
        res.status(429).json({ error: "Trop de tentatives d'authentification. Veuillez réessayer plus tard." });
    },
});