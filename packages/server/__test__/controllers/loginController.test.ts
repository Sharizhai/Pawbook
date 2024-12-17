import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { login } from "../../src/controllers/userController";
import Model from "../../src/models/index";
import { verifyPassword, createAccessToken, createRefreshToken, APIResponse, logger } from "../../src/utils";
import User from "../../src/schemas/users";

// Mocks
jest.mock("../../src/models/index");
jest.mock("../../src/utils");
jest.mock("../../src/schemas/users");

describe("UserController - login", () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.post("/login", login);

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it("should successfully log in a user with valid credentials", async () => {
        const mockUser = {
            _id: "userId123",
            email: "test@example.com",
            password: "hashedPassword",
            toObject: () => ({ _id: "userId123", email: "test@example.com" }),
        };

        // Setup mocks
        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockResolvedValue(true);
        (createAccessToken as jest.Mock).mockReturnValue("accessToken123");
        (createRefreshToken as jest.Mock).mockReturnValue("refreshToken123");
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "Password12345!" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Utilisateur connecté avec succès");
        expect(res.body.data.userWithoutPassword).toBeDefined();
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 if the email is not found", async () => {
        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue(null);
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app)
            .post("/login")
            .send({ email: "nonexistent@example.com", password: "Password12345!" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Échec de connexion: email incorrect");
    });

    it("should return 401 if the password is incorrect", async () => {
        const mockUser = { password: "hashedPassword" };

        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockResolvedValue(false);
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "wrongPassword!12" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Mot de passe incorrect");
    });

    it("should return 500 if an error occurs", async () => {
        (Model.users.findWithCredentials as jest.Mock).mockRejectedValue(new Error("Database error"));
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "Password12345!" });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Erreur lors de la connexion");
    });
});