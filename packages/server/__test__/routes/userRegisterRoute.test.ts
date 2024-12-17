import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { createAUser } from "../../src/controllers/userController";
import Model from "../../src/models/index";
import { hashPassword, APIResponse, logger } from "../../src/utils";
import { userValidation } from "../../src/validation/validation";
import z from "zod";

// Mocks
jest.mock("../../src/models/index");
jest.mock("../../src/utils");
jest.mock("../../src/validation/validation");

describe("UserController - createAUser", () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.post("/register", createAUser);

        jest.clearAllMocks();

        // Prevent console output during tests
        (logger.info as jest.Mock) = jest.fn();
        (logger.warn as jest.Mock) = jest.fn();
        (logger.error as jest.Mock) = jest.fn();
    });

    const validUserData = {
        name: "John",
        firstName: "Doe",
        email: "john.doe@example.com",
        password: "StrongPassword123!",
        role: "USER",
        profilePicture: "",
        profileDescription: "",
    };

    it("should successfully create a new user with valid data", async () => {
        (userValidation.parse as jest.Mock).mockReturnValue(validUserData);
        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue(null);
        (hashPassword as jest.Mock).mockResolvedValue("hashedPassword123");
        (Model.users.create as jest.Mock).mockResolvedValue({
            ...validUserData,
            _id: "newUserId123",
            password: "hashedPassword123",
        });
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app).post("/register").send(validUserData);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Utilisateur créé avec succès");
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBe("newUserId123");
    });

    it("should return 409 if email already exists", async () => {
        (userValidation.parse as jest.Mock).mockReturnValue(validUserData);
        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue({ email: validUserData.email });
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app).post("/register").send(validUserData);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe("E-mail déjà existant");
    });

    it("should return 400 for invalid user data due to Zod validation error", async () => {
        const zodError = new z.ZodError([
            {
                code: "invalid_type",
                expected: "string",
                received: "number",
                path: ["email"],
                message: "Invalid email format",
            },
        ]);
        (userValidation.parse as jest.Mock).mockImplementation(() => {
            throw zodError;
        });
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const invalidUserData = { ...validUserData, email: 123 };

        const res = await request(app).post("/register").send(invalidUserData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Erreur(s) de validation");
        expect(res.body.data).toEqual(["email: Invalid email format"]);
    });

    it("should return 500 if password hashing fails", async () => {
        (userValidation.parse as jest.Mock).mockReturnValue(validUserData);
        (Model.users.findWithCredentials as jest.Mock).mockResolvedValue(null);
        (hashPassword as jest.Mock).mockResolvedValue(null);
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app).post("/register").send(validUserData);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Erreur lors de la création de l'utilisateur");
    });

    it("should return 500 if an unexpected error occurs", async () => {
        (userValidation.parse as jest.Mock).mockImplementation(() => {
            throw new Error("Unexpected error");
        });
        (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
            res.status(status).json({ data, message });
        });

        const res = await request(app).post("/register").send(validUserData);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Erreur lors de la création de l'utilisateur");
    });
});