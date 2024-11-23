import { IEnv } from "../types/env";
import dotenv from "dotenv";

dotenv.config();

export const env: IEnv = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',

    JWT_SECRET: process.env.JWT_SECRET || "¡SecretSecret!123",
    JWT_EXPIRATION_SECRET: process.env.JWT_EXPIRATION_SECRET || "30m",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "¡SecretSecret!321",
    REFRESH_TOKEN_EXPIRATION_SECRET: process.env.REFRESH_TOKEN_EXPIRATION_SECRET || "2j",

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    ORIGIN: process.env.ORIGIN || "http://localhost:5173",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/express",

    // nodemailer
    EMAIL_USER: process.env.EMAIL_USER || "mail@mail.mail",
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD || "¡SecretSecret!",
    JWT_RESET_PWD_SECRET: process.env.JWT_RESET_PWD_SECRET || "¡SecretSecret!",

    // Cloudinary
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || "cloudinary://<your_api_key>:<your_api_secret>@<petit_nuage_fondant>",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "petit_nuage_fondant",
    CLOUDINARY_API_KEY: process.env.MONGO_URI || "your_api_key",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
    LOGO_URL: process.env.LOGO_URL || "¡SecretSecret!",
};