import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Controllers.likes.get);
router.get("/:id", Controllers.likes.where);
router.post("/register", Middlewares.validationLike, Controllers.likes.create);
router.delete("/:postId/:authorId", Controllers.likes.delete);
router.get("/:authorId", Controllers.likes.getByUserId);
router.get("/:postId", Controllers.likes.getByPostId);
router.get("/:animalId", Controllers.likes.getByAnimalId);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.likes.delete);

export default router;