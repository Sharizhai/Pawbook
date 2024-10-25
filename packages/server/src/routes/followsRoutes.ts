import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.follows.get);
router.get("/:id", Controllers.follows.where);
router.post("/register", Middlewares.validationFollow, Controllers.follows.create);
router.delete("/:id", Controllers.follows.delete);
router.get("/user/:authorId", Controllers.follows.getByUserId);

//Delete route for an admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.follows.delete);

export default router;