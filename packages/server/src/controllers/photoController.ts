import { Request, Response } from "express";

import Middlewares from "../middlewares/index";
import { logger, APIResponse } from "../utils";

// Contrôleur pour l'upload d'une photo'
export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        // Appel du middleware d'upload pour gérer le fichier
        Middlewares.upload.single('photo')(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            // Appel du middleware pour mettre à jour l'entité avec les infos de la photo
            await Middlewares.storageEntity(req, res, (nextErr: any) => {
                if (nextErr) {
                    return res.status(500).json({ message: "Erreur lors de la mise à jour de l'entité" });
                }
                // Réponse après la mise à jour réussie de la photo dans l'entité
                res.status(200).json({ message: 'Entité mise à jour avec les informations de la photo' });
            });
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Méthode pour l'upload de plusieurs photos
export const uploadMultipleFiles = async (req: Request, res: Response) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            logger.error("Aucun fichier uploadé");
            return APIResponse(res, null, "Aucun fichier uploadé", 400);
        }

        await Middlewares.storageEntity(req, res, () => {
            const filenames = (req.files as Express.Multer.File[]).map((file) => file.filename);
            logger.info("Fichiers uploadés avec succès: " + filenames.join(", "));
            APIResponse(res, { filenames }, "Fichiers téléchargés avec succès", 200);
        });

    } catch (err: any) {
        logger.error("Erreur lors de l'upload des fichiers: " + err.message);
        APIResponse(res, null, err.message, 500);
    }
};