import path from "path";
import multer from "multer";
import Models from "../models/index";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

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

// Middleware pour mettre à jour les informations avec la photo téléchargée
// export const updateEntityWithPhotoInfo = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "Aucun fichier téléchargé" });
//         }

//         let entityToUpdate: any;
//         const entityId = new Types.ObjectId(req.params.id);

//         if (req.url.includes("user")) {
//             // Mise à jour du profil utilisateur
//             entityToUpdate = await Models.users.where(entityId, res);
//         } else if (req.url.includes("animal")) {
//             // Mise à jour du profil d'animal
//             entityToUpdate = await Models.animals.where(entityId, res);
//         } else if (req.url.includes("post")) {
//             // Mise à jour d'un post
//             entityToUpdate = await Models.posts.where(entityId, res);
//         } 

//         if (!entityToUpdate) {
//             return res.status(404).json({ message: "Entité non trouvée" });
//         }

//         // Mise à jour des informations de la photo
//         entityToUpdate.photoName = req.file.filename;
//         entityToUpdate.photoType = req.file.mimetype;

//         // Sauvegarde de l'entité mise à jour
//         await entityToUpdate.save();

//         next();

//     } catch (err: any) {
//         res.status(500).json({ error: err.message });
//     }
// };

export { uploadFiles };