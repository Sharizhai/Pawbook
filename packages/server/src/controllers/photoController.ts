import Middlewares from "../middlewares/index";

import { Request, Response } from "express";

// Contrôleur pour l'upload de photos
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