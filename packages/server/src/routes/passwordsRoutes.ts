import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.post("/forgotten", Controllers.passwords.forget);
router.post("/reset/:token", Controllers.passwords.reset);

//Routes pour un admin
router.post("/forgotten", Middlewares.isAdmin, Controllers.passwords.forget);
router.post("/reset/:token", Middlewares.isAdmin, Controllers.passwords.reset);

export default router;