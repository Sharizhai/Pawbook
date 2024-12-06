import { Router } from 'express';
import mongoose from 'mongoose';

import Controllers from "../controllers";
import Middlewares from '../middlewares';
import { APIResponse } from '../utils/responseUtils';

const router = Router();

// router.get("/verifyLogin", Middlewares.authentication, (req, res) => {
//     console.log("Utilisateur authentifié :", res.locals.user);
//     if (!res.locals.user?.id) {
//         console.log("Échec de vérification : utilisateur non trouvé");
//         return APIResponse(res, null, "Utilisateur non trouvé", 401);
//     }
//     APIResponse(res, res.locals.user.id, "Login successful", 200);
// });

router.get("/verifyId/:id", Middlewares.authentication, Middlewares.identityVerification, (req, res) => {
    return APIResponse(res, true, "User ID matches", 200);
});

router.get("/verifyLogin", Middlewares.authentication, (req, res) => {
    console.log("res.locals.user.id", res.locals.user.id);
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
router.put("/admin/:id", Middlewares.isAdmin, Middlewares.validationUserAdminUpdate, Controllers.users.adminUpdate);
router.delete("/admin/:id", Middlewares.isAdmin, Controllers.users.delete);

export default router;