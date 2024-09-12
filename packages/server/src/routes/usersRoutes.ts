import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';
import { APIResponse } from '../utils/response';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.users.get);
router.get("/:id", Middlewares.isAdmin, Controllers.users.where);
router.post("/register", Middlewares.validationUser, Controllers.users.create);
router.delete("/:id", Middlewares.isAdmin, Controllers.users.delete); // delete un user pour les admin
router.put("/:id", Middlewares.isAdmin, Middlewares.validationUser, Controllers.users.update); //Fonction modificacion des users pour les admin
router.post("/login", Controllers.users.login);
router.post("/logout", Controllers.users.logout);
router.post("/verifyLogin", Middlewares.auth, (req, res) => {
    APIResponse(res, true, "Login successful", 200);
});

export default router;