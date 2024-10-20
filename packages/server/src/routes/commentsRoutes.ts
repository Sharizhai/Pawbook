import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Controllers.comments.get);
router.get("/:id",Controllers.comments.where);
router.post("/register", Middlewares.validationComment, Controllers.comments.create);
router.delete("/:postId/:authorId", Controllers.comments.delete);
router.put("/:id", Middlewares.validationComment, Controllers.comments.update);
router.get("/user/:authorId", Controllers.comments.getByUserId);
router.get("/user/:postId", Controllers.comments.getByPostId);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.comments.delete);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationComment, Controllers.comments.update);

export default router;