import { Router } from 'express';

import Controllers from "../controllers";
import Middlewares from '../middlewares';
import { APIResponse } from '../utils/responseUtils';

const router = Router();

router.get("/", Middlewares.isAdmin, Controllers.users.get);
router.get("/:id", Middlewares.isAdmin, Controllers.users.where);
router.post("/register", Middlewares.validationUser, Controllers.users.create);
router.delete("/:id", Controllers.users.delete);
router.put("/:id", Middlewares.validationUser, Controllers.users.update);
router.post("/login", Controllers.users.login);
router.post("/logout", Controllers.users.logout);
router.post("/verifyLogin", Middlewares.authentication, (req, res) => {
    APIResponse(res, true, "Login successful", 200);
});

//Routes delete et update pour un admin
router.delete("/admin/:id", Middlewares.isAdmin, Controllers.users.delete);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationUser, Controllers.users.update);

export default router;