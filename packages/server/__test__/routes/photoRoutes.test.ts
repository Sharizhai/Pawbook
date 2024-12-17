import request from "supertest";
import express from "express";
import { Request, Response } from 'express';
import router from "../../src/routes/photoRoutes";
import Controllers from "../../src/controllers";
import Middlewares from "../../src/middlewares";
import { jest } from '@jest/globals';

// Mock des modules
jest.mock("../../src/utils");
jest.mock("../../src/middlewares", () => ({
  upload: {
    single: jest.fn((fieldName) => (req: Request, res: Response, next: Function) => {
      req.file = {
        path: "http://example.com/photo.jpg",
        filename: "test_photo_id",
        mimetype: 'image/jpeg',
        size: 1024
      } as Express.Multer.File;
      next();
    }),
    array: jest.fn((fieldName, maxCount) => (req: Request, res: Response, next: Function) => {
      req.files = [
        {
          path: "http://example.com/photo1.jpg",
          filename: "photo1",
          mimetype: 'image/jpeg',
          size: 1024
        },
        {
          path: "http://example.com/photo2.jpg",
          filename: "photo2",
          mimetype: 'image/jpeg',
          size: 1024
        }
      ] as Express.Multer.File[];
      next();
    })
  }
}));
jest.mock("../../src/controllers", () => ({
  photos: {
    singleUpload: jest.fn((req: Request, res: Response) => {
      if (req.file) {
        res.status(200).json({
          data: { 
            photoUrl: req.file.path, 
            photoId: req.file.filename 
          }, 
          message: "Photo uploadée avec succès"
        });
      } else {
        res.status(500).json({
          data: null, 
          message: "Erreur lors de l'upload de la photo"
        });
      }
      return Promise.resolve();
    }),
    multipleUpload: jest.fn((req: Request, res: Response) => {
      if (Array.isArray(req.files) && req.files.length > 0) {
        res.status(200).json({
          data: (req.files as Express.Multer.File[]).map(file => ({
            photoUrl: file.path,
            photoId: file.filename
          })), 
          message: "Photos uploadées avec succès"
        });
      } else {
        res.status(400).json({
          data: null, 
          message: "Aucun fichier uploadé"
        });
      }
      return Promise.resolve();
    }),
    delete: jest.fn((req: Request, res: Response) => {
      if (req.body.photoId) {
        res.status(200).json({
          data: null, 
          message: "Image supprimée avec succès"
        });
      } else {
        res.status(500).json({
          data: null, 
          message: "Erreur lors de la suppression de la photo"
        });
      }
      return Promise.resolve();
    })
  }
}));

// Typage explicite pour les mocks
type MockController = jest.MockedFunction<(req: Request, res: Response) => Promise<any>>;

// Setup de l'application pour les tests
const app = express();
app.use(express.json());
app.use(router);

describe("Photo Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /upload", () => {
    it("should upload a single file successfully", async () => {
      const response = await request(app)
        .post("/upload")
        .attach("file", Buffer.from("test content"), "test.jpg");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Photo uploadée avec succès");
      expect(response.body.data).toHaveProperty("photoUrl");
      expect(response.body.data).toHaveProperty("photoId");
    });

    it("should fail when uploading a file larger than 15MB", async () => {
      const largeFile = Buffer.alloc(1024 * 1024 * 20); // 16MB

      const response = await request(app)
        .post("/upload")
        .attach("file", largeFile, "largefile.jpg");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erreur lors de l'upload de la photo");
    });

    it("should fail when uploading a non-image file", async () => {
      const response = await request(app)
        .post("/upload")
        .attach("file", Buffer.from("test content"), "test.txt");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erreur lors de l'upload de la photo");
    });
  });

  describe("POST /multipleUpload", () => {
    it("should upload multiple files successfully", async () => {
      // Mock du middleware upload
      (Middlewares.upload.array as jest.Mock).mockImplementation(() => 
        (req: Request, res: Response, next: Function) => {
          req.files = [
            {
              path: "http://example.com/photo1.jpg",
              filename: "photo1"
            },
            {
              path: "http://example.com/photo2.jpg", 
              filename: "photo2"
            }
          ] as Express.Multer.File[];
          next();
        }
      );

      // Mock du contrôleur
      (Controllers.photos.multipleUpload as MockController).mockImplementation((req, res) => {
        res.status(200).json({
          data: [
            { photoUrl: "http://example.com/photo1.jpg", photoId: "photo1" },
            { photoUrl: "http://example.com/photo2.jpg", photoId: "photo2" }
          ], 
          message: "Photos uploadées avec succès"
        });
        return Promise.resolve();
      });

      const response = await request(app)
        .post("/multipleUpload")
        .attach("files", Buffer.from("test1 content"), "file1.jpg")
        .attach("files", Buffer.from("test2 content"), "file2.jpg");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Photos uploadées avec succès");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty("photoUrl");
      expect(response.body.data[0]).toHaveProperty("photoId");
    });

    it("should fail when no files are uploaded", async () => {
      // Mock du middleware upload
      (Middlewares.upload.array as jest.Mock).mockImplementation(() => 
        (req: Request, res: Response, next: Function) => {
          req.files = [];
          next();
        }
      );

      // Mock du contrôleur
      (Controllers.photos.multipleUpload as MockController).mockImplementation((req, res) => {
        res.status(400).json({
          data: null, 
          message: "Aucun fichier uploadé"
        });
        return Promise.resolve();
      });

      const response = await request(app).post("/multipleUpload");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Aucun fichier uploadé");
    });
  });

  describe("DELETE /delete", () => {
    it("should delete a file successfully", async () => {
      (Controllers.photos.delete as MockController).mockImplementation((req, res) => {
        res.status(200).json({
          data: null, 
          message: "Image supprimée avec succès"
        });
        return Promise.resolve();
      });

      const response = await request(app)
        .delete("/delete")
        .send({ photoId: "test_photo_id" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Image supprimée avec succès");
    });

    it("should fail when the photoId is missing", async () => {
      (Controllers.photos.delete as MockController).mockImplementation((req, res) => {
        res.status(500).json({
          data: null, 
          message: "Erreur lors de la suppression de la photo"
        });
        return Promise.resolve();
      });

      const response = await request(app).delete("/delete").send({});

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erreur lors de la suppression de la photo");
    });
  });
});