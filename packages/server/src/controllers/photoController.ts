// import { Request, Response } from "express";

// import Middlewares from "../middlewares/index";
// import { logger, APIResponse } from "../utils";

// // Contrôleur pour l'upload d'une photo'
// export const uploadPhoto = async (req: Request, res: Response) => {
//     try {
//         logger.info("[GET] /photos/singleUpload - Upload d'une photo en cours");
//         // Appel du middleware d'upload pour gérer le fichier
//         Middlewares.upload.single('photo')(req, res, async (err: any) => {
//             if (err) {
//                 logger.error("Erreur lors de l'upload de la photo: " + err.message);
//                 return APIResponse(res, null, err.message, 400);
//             }

//             // Appel du middleware pour mettre à jour l'entité avec les infos de la photo
//             await Middlewares.storageEntity(req, res, (nextErr: any) => {
//                 if (nextErr) {
//                     logger.error("Erreur lors de la mise à jour de l'entité: " + nextErr.message);
//                     return APIResponse(res, null, "Erreur lors de la mise à jour de l'entité", 500);
//                 }
//                 // Réponse après la mise à jour réussie de la photo dans l'entité
//                 logger.info("Photo mise à jour avec succès dans l'entité");
//                 return APIResponse(res, { message: 'Entité mise à jour avec les informations de la photo' }, "Photo uploadée avec succès", 200);
//             });
//         });
//     } catch (err: any) {
//         logger.error("Erreur lors de l'upload de la photo: " + err.message);
//         return APIResponse(res, null, err.message, 500);
//     }
// };

// // Méthode pour l'upload de plusieurs photos
// export const uploadMultipleFiles = async (req: Request, res: Response) => {
//     try {
//         logger.info("[GET] /photos/multipleUpload - Upload d'une photo en cours");
//         if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
//             logger.error("Aucun fichier uploadé");
//             return APIResponse(res, null, "Aucun fichier uploadé", 400);
//         }

//         await Middlewares.storageEntity(req, res, () => {
//             const filenames = (req.files as Express.Multer.File[]).map((file) => file.filename);
//             logger.info("Fichiers uploadés avec succès: " + filenames.join(", "));
//             APIResponse(res, { filenames }, "Fichiers téléchargés avec succès", 200);
//         });

//     } catch (err: any) {
//         logger.error("Erreur lors de l'upload des fichiers: " + err.message);
//         APIResponse(res, null, err.message, 500);
//     }
// };