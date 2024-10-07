import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.likes.get);
router.get("/:id", Middlewares.isAdmin, Controllers.likes.where);
router.post("/register", Middlewares.validationComment, Controllers.likes.create);
router.delete("/:id", Controllers.likes.delete);
router.get("/user/:authorId", Controllers.likes.getByUserId);
router.get("/user/:postId", Controllers.likes.getByPostId);
router.get("/user/:postId", Controllers.likes.getByPostId);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.likes.delete);

export default router;