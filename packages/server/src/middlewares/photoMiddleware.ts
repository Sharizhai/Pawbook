import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request, Response, NextFunction } from "express";

// On configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// On configure le stockage Multer pour Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pawbook/uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req: Express.Request, file: Express.Multer.File) => 'picture' + Date.now(),
    } as any,
});

const fileFilter = (request: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File not supported'));
    }
};

// Middleware pour gérer le téléchargement de fichiers
const uploadFiles = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // Limite de 15 Mo
    fileFilter: fileFilter
});

export { uploadFiles };