import { IEnv } from "../types/env";
import dotenv from "dotenv";

dotenv.config();

export const env: IEnv = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',

    JWT_SECRET: process.env.JWT_SECRET || (() => {
        throw new Error('JWT_SECRET must be defined');
    })(),
    JWT_EXPIRATION_SECRET: process.env.JWT_EXPIRATION_SECRET || (() => {
        throw new Error('JWT_EXPIRATION_SECRET must be defined');
    })(),
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || (() => {
        throw new Error('REFRESH_TOKEN_SECRET must be defined');
    })(),
    REFRESH_TOKEN_EXPIRATION_SECRET: process.env.REFRESH_TOKEN_EXPIRATION_SECRET || (() => {
        throw new Error('REFRESH_TOKEN_EXPIRATION_SECRET must be defined');
    })(),

    FRONTEND_URL: process.env.FRONTEND_URL || (() => {
        throw new Error('FRONTEND_URL must be defined');
    })(),
    ORIGIN: process.env.ORIGIN || (() => {
        throw new Error('ORIGIN must be defined');
    })(),
    MONGO_URI: process.env.MONGO_URI || (() => {
        throw new Error('MONGO_URI must be defined');
    })(),

    // nodemailer
    EMAIL_USER: process.env.EMAIL_USER || (() => {
        throw new Error('EMAIL_USER must be defined');
    })(),
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD || (() => {
        throw new Error('EMAIL_APP_PASSWORD must be defined');
    })(),
    JWT_RESET_PWD_SECRET: process.env.JWT_RESET_PWD_SECRET || (() => {
        throw new Error('JWT_RESET_PWD_SECRET must be defined');
    })(),

    // Cloudinary
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || (() => {
        throw new Error('CLOUDINARY_URL must be defined');
    })(),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || (() => {
        throw new Error('CLOUDINARY_CLOUD_NAME must be defined');
    })(),
    CLOUDINARY_API_KEY: process.env.MONGO_URI || (() => {
        throw new Error('MONGO_URI must be defined');
    })(),
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || (() => {
        throw new Error('CLOUDINARY_API_SECRET must be defined');
    })(),
    LOGO_URL: process.env.LOGO_URL || (() => {
        throw new Error('LOGO_URL must be defined');
    })(),

    // Helmet
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || (() => {
        throw new Error('FRONTEND_DOMAIN must be defined');
    })(),
    BACKEND_URL: process.env.BACKEND_URL || (() => {
        throw new Error('BACKEND_URL must be defined');
    })(),
};