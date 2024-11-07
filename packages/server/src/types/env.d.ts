export interface IEnv {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    JWT_RESET_PWD_SECRET: string;
    FRONTEND_URL: string;
    ORIGIN: string;
    MONGO_URI: string;
    CLOUDINARY_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    LOGO_URL: string;
}