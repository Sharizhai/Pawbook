import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';

const router = Router();

router.post("/forgotten", Controllers.passwords.forget);
router.post("/reset/:token", Middlewares.validationResetPassword, Controllers.passwords.reset);

//Routes pour un admin
router.post("/admin/forgotten", Middlewares.isAdmin, Controllers.passwords.forget);
router.post("/admin/reset/:token", Middlewares.isAdmin, Controllers.passwords.reset);

export default router;