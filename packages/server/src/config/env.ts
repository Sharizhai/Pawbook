import { IEnv } from "../types/env";
import dotenv from "dotenv";

dotenv.config();

export const env: IEnv = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    JWT_SECRET: process.env.JWT_SECRET || "¡SecretSecret!",
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "string",
    JWT_EXPIRATION_SECRET: process.env.JWT_EXPIRATION_SECRET || "string",
    REFRESH_JWT_EXPIRATION_SECRET: process.env.REFRESH_JWT_EXPIRATION_SECRET || "string",
    ORIGIN: process.env.ORIGIN || "http://localhost:5173",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/express"
};