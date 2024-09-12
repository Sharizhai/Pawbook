export interface IEnv {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    ORIGIN: string;
    MONGO_URI: string;
}