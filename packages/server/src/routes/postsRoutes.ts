import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Controllers.posts.get);
router.get("/:id", Controllers.posts.where);
router.post("/create", Middlewares.validationPost, Controllers.posts.create);
router.delete("/:postId/:authorId", Controllers.posts.delete);
router.put("/:id", Middlewares.validationPost, Controllers.posts.update);
router.get("/user/:authorId", Controllers.posts.getByUserId);

//Routes delete et update pour un admin
router.get("/admin/user/:authorId", Middlewares.isAdmin, Controllers.posts.adminGetByUserId);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationPostAdmin, Controllers.posts.adminUpdate);
router.delete("/admin/:postId/:authorId", Middlewares.isAdmin, Controllers.posts.delete);

export default router;