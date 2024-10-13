import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Controllers.posts.get);
router.get("/:id", Controllers.posts.where);
router.post("/create", Middlewares.validationPost, Controllers.posts.create);
router.delete("/:id", Controllers.posts.delete);
router.put("/:id", Middlewares.validationPost, Controllers.posts.update);
router.get("/user/:authorId", Controllers.posts.getByUserId);
router.get("/user/me", Controllers.posts.me);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.posts.delete);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationPost, Controllers.posts.update);

export default router;