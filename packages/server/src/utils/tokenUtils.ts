import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { logger } from "./loggerUtils";

const { JWT_SECRET, REFRESH_JWT_SECRET, JWT_EXPIRATION_SECRET, REFRESH_JWT_EXPIRATION_SECRET} = env;

//Function to generate an access token
export const generateAccessToken = (role: string, userId: string): string => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_SECRET });
};

//Function to generate a refresh token
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, REFRESH_JWT_SECRET, { expiresIn: REFRESH_JWT_EXPIRATION_SECRET });
};

//Function to verify a refresh token
export const verifyRefreshToken = (refreshToken: string): string | null => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (err) {
        logger.error("Invalide Refresh Token:" + err);
        return null;
    }
};