import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.followers.get);
router.get("/:id", Controllers.followers.where);
router.post("/register", Middlewares.validationFollower, Controllers.followers.create);
router.delete("/:id", Controllers.followers.delete);
router.get("/user/:authorId", Controllers.followers.getByUserId);

//Delete route for an admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.followers.delete);

export default router;