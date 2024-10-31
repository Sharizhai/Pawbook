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
    //let uploadFolder = "uploads/";

        // if (req.url.includes("profile")) {
        //     uploadFolder = "uploads/profiles/";
        // } else if (req.url.includes("animal")) {
        //     uploadFolder = "uploads/animals/";
        // } else if (req.url.includes("post")) {
        //     uploadFolder = "uploads/posts/";
        // }

        callback(null, "src/uploads");
    },
    filename: (req: Request, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
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