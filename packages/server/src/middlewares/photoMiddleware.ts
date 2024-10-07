import path from "path";
import multer from "multer";
import Models from "../models/index";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

// Méthode pour générer  un nom de fichier aléatoire avec un timestamp
const generateRandomFileName = () => {
    const randomString : string = Math.random().toString(36).substring(2, 15);
    const timestamp : Date = new Date();
    return `${timestamp}-${randomString}`;
};

// Méthode pour configurer le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req: Request, file, callback) => {
    //Méthode pour conditionner la destination du fichier en fonction du type de photo
    let uploadFolder = "uploads/";

        if (req.url.includes("profile")) {
            uploadFolder = "uploads/profiles/";
        } else if (req.url.includes("animal")) {
            uploadFolder = "uploads/animals/";
        } else if (req.url.includes("post")) {
            uploadFolder = "uploads/posts/";
        }

        callback(null, uploadFolder);
    },
    filename: (req: Request, file, callback) => {
        const randomFileName: string = generateRandomFileName();
        const extension: string = path.extname(file.originalname);
        callback(null, randomFileName + extension);
    }
});

//Méthode pour le filtrage des fichiers : on défini quels fichiers on accepte
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const fileTypes: RegExp = /jpeg|jpg|png/;
    const extname: boolean = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype: boolean = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback(new Error("Seuls les fichiers .jpeg, .jpg et .png sont autorisés !"));
    }
};

// Middleware pour gérer le téléchargement de fichiers
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // Limite de 15 Mo
    fileFilter: fileFilter
});

// Middleware pour mettre à jour les informations avec la photo téléchargée
export const updateEntityWithPhotoInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier téléchargé" });
        }

        let entityToUpdate: any;
        const entityId = new Types.ObjectId(req.params.id);

        if (req.url.includes("user")) {
            // Mise à jour du profil utilisateur
            entityToUpdate = await Models.users.where(entityId, res);
        } else if (req.url.includes("animal")) {
            // Mise à jour du profil d'animal
            entityToUpdate = await Models.animals.where(entityId, res);
        } else if (req.url.includes("post")) {
            // Mise à jour d'un post
            entityToUpdate = await Models.posts.where(entityId, res);
        } 

        if (!entityToUpdate) {
            return res.status(404).json({ message: "Entité non trouvée" });
        }

        // Mise à jour des informations de la photo
        entityToUpdate.photoName = req.file.filename;
        entityToUpdate.photoType = req.file.mimetype;

        // Sauvegarde de l'entité mise à jour
        await entityToUpdate.save();

        next();

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export { upload };