import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import cookieParser from "cookie-parser";
import { refreshTokenMiddleware } from "../../src/middlewares/refreshTokenMiddleware";
import User from "../../src/schemas/users";
import { APIResponse, createAccessToken, createRefreshToken } from "../../src/utils";

// Mocks
jest.mock("jsonwebtoken");
jest.mock("../../src/schemas/users");
jest.mock("../../src/utils");
jest.mock("../../src/config/env", () => ({
  env: {
    JWT_SECRET: "test_secret",
    REFRESH_TOKEN_SECRET: "refresh_test_secret",
    NODE_ENV: "test"
  }
}));

describe("refreshTokenMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    // Créer une application Express pour tester le middleware
    app = express();
    app.use(cookieParser());
    app.use(express.json());
    
    // Route de test pour le middleware
    app.get("/test-refresh", refreshTokenMiddleware, (req, res) => {
      res.status(200).json({ message: "Success" });
    });

    // Reset des mocks
    jest.clearAllMocks();

    // Mock APIResponse
    (APIResponse as jest.Mock).mockImplementation((res, data, message, status) => {
      res.status(status).json({ message, data });
    });
  });

  it("should return 403 if no refresh token", async () => {
    const response = await request(app)
      .get("/test-refresh")
      .set("Cookie", []);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid Refresh Token.");
  });

  it("devrait gérer les erreurs de token invalide", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token invalide");
    });

    const response = await request(app)
      .get("/test-refresh")
      .set("Cookie", ["refreshToken=invalid_token"]);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error processing refresh token.");
  });

  it("should refresh token if user is valid", async () => {
    // Créer un mock user ID
    const mockUserId = new Types.ObjectId();

    // Mocks des différentes étapes
    (jwt.verify as jest.Mock).mockReturnValue({ 
      id: mockUserId.toString() 
    });
    
    // Mock findById avec le bon refreshToken
    const mockUser = {
      id: mockUserId,
      refreshToken: "validRefreshToken",
      select: jest.fn().mockResolvedValue({
        id: mockUserId,
        refreshToken: "validRefreshToken"
      })
    };

    (User.findById as jest.Mock).mockReturnValue(mockUser);

    // Créer de nouveaux tokens
    const mockNewAccessToken = "newAccessToken";
    const mockNewRefreshToken = "newRefreshToken";

    // Mock création des tokens
    (createAccessToken as jest.Mock).mockReturnValue(mockNewAccessToken);
    (createRefreshToken as jest.Mock).mockReturnValue(mockNewRefreshToken);

    // Mock update du user
    const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({});
    (User.findByIdAndUpdate as jest.Mock).mockImplementation(mockFindByIdAndUpdate);

    // Effectuer la requête
    const response = await request(app)
      .get("/test-refresh")
      .set("Cookie", [`refreshToken=validRefreshToken`]);

    // Assertions
    expect(response.status).toBe(200);
    
    // Vérifier que findByIdAndUpdate a été appelé avec les bons arguments
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      mockUserId, 
      { refreshToken: mockNewRefreshToken },
      expect.anything()
    );
  });

  it("devrait passer au middleware suivant si l\'utilisateur n\'est pas trouvé", async () => {
    const mockUserId = new Types.ObjectId();

    (jwt.verify as jest.Mock).mockReturnValue({ 
      id: mockUserId.toString() 
    });
    
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const response = await request(app)
      .get("/test-refresh")
      .set("Cookie", [`refreshToken=someToken`]);

    // Comme le middleware utilise next(), la route de test devrait répondre
    expect(response.status).toBe(200);
  });
});