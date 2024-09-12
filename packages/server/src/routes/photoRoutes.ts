import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';


const router = Router();

router.post('/upload/:id', Middlewares.isAdmin, Middlewares.storage.single('photo'), Controllers.photos.upload);
router.get("/photo/:id", Controllers.locations.photo);

export default router;