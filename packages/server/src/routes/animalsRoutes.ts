import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.animals.get);
router.get("/:id", Middlewares.isAdmin, Controllers.animals.where);
router.post("/register", Middlewares.validationComment, Controllers.animals.create);
router.delete("/:id", Controllers.animals.delete);
router.put("/:id", Middlewares.validationComment, Controllers.animals.update);
router.get("/user/:ownerId", Controllers.animals.getByOwnerId);
router.get("/user/:criteria", Controllers.animals.getByCriteria);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.animals.delete);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationComment, Controllers.animals.update);

export default router;