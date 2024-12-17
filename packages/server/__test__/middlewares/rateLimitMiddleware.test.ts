import request from "supertest";
import express from "express";
import { adminRateLimiter, authenticationRateLimiter } from "../../src/middlewares/rateLimitMiddleware";
import { logger } from "../../src/utils";

jest.mock("../../src/utils");

describe("Test des middlewares adminRateLimiter et authenticationRateLimiter", () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.get("/admin", adminRateLimiter, (req, res) => {
            res.status(200).json({ message: "Admin access granted" });
        });
        app.post("/auth", authenticationRateLimiter, (req, res) => {
            res.status(200).json({ message: "Authentication successful" });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should allow requests under the rate limit for admin routes", async () => {
        for (let i = 0; i < 5; i++) {
            const res = await request(app).get("/admin");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Admin access granted");
        }
    });

    it("should block requests exceeding the rate limit for admin routes", async () => {
        for (let i = 0; i < 501; i++) {
            await request(app).get("/admin");
        }

        const res = await request(app).get("/admin");
        expect(res.status).toBe(429);
        expect(res.body.error).toBe("Trop de requêtes. Veuillez réessayer plus tard.");
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("Rate limit exceeded"));
    });

    it("should allow requests under the rate limit for authentication routes", async () => {
        for (let i = 0; i < 5; i++) {
            const res = await request(app).post("/auth");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Authentication successful");
        }
    });

    it("should block requests exceeding the rate limit for authentication routes", async () => {
        for (let i = 0; i < 11; i++) {
            await request(app).post("/auth");
        }

        const res = await request(app).post("/auth");
        expect(res.status).toBe(429);
        expect(res.body.error).toBe("Trop de tentatives d\'authentification. Veuillez réessayer plus tard.");
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("Rate limit exceeded"));
    });
});