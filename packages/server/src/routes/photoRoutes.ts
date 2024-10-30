import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';


const router = Router();

// Route pour uploader un fichier 
router.post("/upload", Middlewares.authentication, Controllers.photos.singleUpload);

// // Routes pour les photos de l'utilisateur
// router.post('/user/:id/profile-photo', Middlewares.authentication, uploadUserProfilePhoto);
// router.post('/user/:id/post-photo', Middlewares.authentication, uploadUserPostPhoto);
// router.get('/user/:id/photos', Middlewares.authentication, getUserPhotos);
// router.delete('/user/:id/photo/:photoId', Middlewares.authentication, deleteUserPhoto);

// // Routes pour les photos des animaux et des posts (inchangées)
// router.post('/animal/:id/photo', Middlewares.authentication, uploadAnimalPhoto);
// router.post('/post/:id/photo', Middlewares.authentication, uploadPostPhoto);

export default router;