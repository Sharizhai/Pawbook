import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.get("/", Controllers.animals.get);
router.get("/:id", Controllers.animals.where);
router.post("/register", Middlewares.validationAnimal, Controllers.animals.create);
router.delete("/:animalId/:ownerId", Controllers.animals.delete);
router.put("/:id", Middlewares.validationAnimal, Controllers.animals.update);
router.get("/user/:ownerId", Controllers.animals.getByOwnerId);
router.get("/user/:criteria", Controllers.animals.getByCriteria);

//Routes delete et update pour un admin
router.delete("/admin/:id/", Middlewares.isAdmin, Controllers.animals.delete);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationAnimal, Controllers.animals.update);

export default router;