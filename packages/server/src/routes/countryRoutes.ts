import { Router } from 'express';

import Controllers from '../controllers';
import Middlewares from '../middlewares';


const router = Router();

router.get("/", Controllers.countries.get);
router.get("/:id", Controllers.countries.where);
router.post("/", Middlewares.validationCountries, Middlewares.isAdmin, Controllers.countries.create);
router.delete("/:id",Middlewares.isAdmin, Controllers.countries.delete);
router.put("/:id",Middlewares.isAdmin, Middlewares.validationCountries, Controllers.countries.update);

export default router;