import jwt from "jsonwebtoken";
import { env } from "../config/env";

const { JWT_SECRET, JWT_EXPIRATION_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_SECRET } = env;

// On crée un token d'accès
export const createAccessToken = (userId: string): string => {
    return jwt.sign({id: userId}, JWT_SECRET, { expiresIn: JWT_EXPIRATION_SECRET});
};

// On crée un token de rafraîchissement
export const createRefreshToken = (userId: string): string => {
    return jwt.sign({id: userId}, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_SECRET});
};

// On vérifie le token de rafraîchissement
export const verifyRefreshToken = (token: string): string | null => {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
      return decoded.userId;
    } catch (err) {
      console.error('Invalid Refresh Token', err);
      return null;
    }
  };