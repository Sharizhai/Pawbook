import { Router } from 'express';

import Middlewares from '../middlewares';
import Controllers from "../controllers";

const router = Router();

router.get("/", Controllers.locations.get);
router.get("/:id", Controllers.locations.where);
router.get("/country/:countryId", Controllers.locations.fromWhere);
router.post("/", Middlewares.isAdmin, Middlewares.validationLocation, Controllers.locations.create);
router.delete("/:id", Middlewares.isAdmin, Controllers.locations.delete);
router.put("/:id", Middlewares.isAdmin, Middlewares.validationLocation, Controllers.locations.update);

export default router;