export interface IEnv {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    JWT_EXPIRATION_SECRET: string;
    REFRESH_JWT_EXPIRATION_SECRET: string;
    ORIGIN: string;
    MONGO_URI: string;
}