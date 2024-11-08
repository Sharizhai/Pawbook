import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

import { logger, APIResponse } from "../utils";
import Animal from "../schemas/animals";

// Contrôleur pour l'upload d'une photo'
// export const uploadPhoto = async (req: Request, res: Response) => {
//     try {
//         logger.info("[POST] /photos/singleUpload - Upload d'une photo en cours");
        
//         if (!req.file) {
//             logger.error("Aucun fichier n'a été uploadé");
//             return APIResponse(res, null, "Aucun fichier n'a été uploadé", 400);
//         }

//         const fileInfo = {
//             photoName: req.file.filename,
//             photoType: req.file.mimetype,
//             path: req.file.path
//         };

//         logger.info("Photo uploadée avec succès");
//         return APIResponse(res, fileInfo, "Photo uploadée avec succès", 200);
        
//     } catch (err: any) {
//         logger.error("Erreur lors de l'upload de la photo: " + err);
//         return APIResponse(res, null, err.message, 500);
//     }
// };

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        logger.info("[POST] /photos/singleUpload - Upload d'une photo en cours");

        if (!req.file) {
            logger.error("Aucun fichier n'a été uploadé");
            return APIResponse(res, null, "Aucun fichier n'a été uploadé", 400);
        }

        const fileInfo = {
            photoUrl: req.file.path, // L'URL Cloudinary de l'image
            photoId: req.file.filename, // L'ID unique dans Cloudinary
        };

        logger.info("Photo uploadée avec succès");
        return APIResponse(res, fileInfo, "Photo uploadée avec succès", 200);
    } catch (err: any) {
        logger.error("Erreur lors de l'upload de la photo: " + err);
        return APIResponse(res, null, "Erreur lors de l'upload de la photo", 500);
    }
};

// Méthode pour l'upload de plusieurs photos
export const uploadMultipleFiles = async (req: Request, res: Response) => {
    try {
        logger.info("[GET] /photos/multipleUpload - Upload d'une photo en cours");
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            logger.error("Aucun fichier uploadé");
            return APIResponse(res, null, "Aucun fichier uploadé", 400);
        }

        // await Middlewares.storageEntity(req, res, () => {
        //     const filenames = (req.files as Express.Multer.File[]).map((file) => file.filename);
        //     logger.info("Fichiers uploadés avec succès: " + filenames.join(", "));
        //     APIResponse(res, { filenames }, "Fichiers téléchargés avec succès", 200);
        // });

    } catch (err: any) {
        logger.error("Erreur lors de l'upload des fichiers: " + err.message);
        APIResponse(res, null, err.message, 500);
    }
};

// // Méthode pour la suppression d'une photo
// export const deletePhoto = async ( req: Request, res: Response ) => {
//     try {
//         const { photoName } = req.body;
//         const { animalId } = req.body;
//         const photoPath = path.join('src', 'uploads', photoName);
//         logger.info(`[DELETE] /photos - Suppression de la photo : ${photoName}`);

//         if (animalId) {
//             await Animal.findByIdAndUpdate(animalId, {
//                 $unset: { picture: "" }
//             });
//         }
        
//         try {
//             await fs.access(photoPath);
//             await fs.unlink(photoPath);
            
//             logger.info("Image supprimée avec succès");
//             return APIResponse(res, null, "Image supprimée avec succès", 200);          
//         } catch (error:any) {
//             if (error.code === 'ENOENT') {
//                 logger.warn(`Image non trouvée : ${photoName}`);
//                 return APIResponse(res, null, "Image non trouvée", 404);
//             }
//             throw error;
//         }
        
//     } catch (error:any) {
//         logger.error(`Erreur lors de la suppression de l'image : ${error.message}`);
//         return APIResponse(res, null, "Erreur lors de la suppression de l'image", 500);
//     }
// };

export const deletePhoto = async (request: Request, response: Response) => {
    try {
        const { photoId } = request.body;
        logger.info(`[DELETE] /photos - Suppression de la photo : ${photoId}`);
        
        await cloudinary.uploader.destroy(photoId);

        logger.info("Image supprimée avec succès");
        return APIResponse(response, null, "Photo supprimée avec succès", 200);
    } catch (error: any) {
        logger.error(`Erreur lors de la suppression de l'image : ${error.message}`);
        return APIResponse(response, null, "Erreur lors de la suppression de la photo", 500);
    }
};