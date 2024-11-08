import { Router } from 'express';
import mongoose from 'mongoose';

import Controllers from "../controllers";
import Middlewares from '../middlewares';
import { APIResponse } from '../utils/responseUtils';

const router = Router();

router.get("/verifyLogin", Middlewares.authentication, (req, res) => {
    APIResponse(res, res.locals.user.id, "Login successful", 200);
});

router.get("/verifyAdmin", Middlewares.isAdmin, (req, res) => {
    APIResponse(res, {
        id: res.locals.user.id,
        role: res.locals.user.role,
        isAdmin: res.locals.user.role === 'ADMIN'
    }, "Admin verification successful", 200);
});

router.post("/register", Middlewares.validationUser, Controllers.users.create);
router.delete("/:id", Controllers.users.delete);
router.put("/:id", Middlewares.validationUserUpdate, Controllers.users.update);
router.post("/login", Controllers.users.login);
router.get("/logout", Controllers.users.logout);
router.get("/:id", Controllers.users.where);
router.get("/me", Middlewares.authentication, Controllers.users.me);

//Routes pour un admin
router.get("/", Middlewares.isAdmin, Controllers.users.get);
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationUser, Controllers.users.update);
router.delete("/admin/:id", Middlewares.isAdmin, Controllers.users.delete);

export default router;