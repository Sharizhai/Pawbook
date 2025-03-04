import { Request, Response, NextFunction } from "express";
import { userValidation, userUpdateValidation, userAdminUpdateValidation, postValidation, commentValidation, likeValidation, followValidation, followerValidation, animalValidation, postAdminUpdateValidation, commentUpdateAdminValidation, userResetPasswordValidation } from "../validation/validation";
import { z } from "zod";
import { APIResponse, logger } from "../utils";

//Middleware de validation des données utilisateur
export const validationUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données de l'utilisateur avec Zod
        userValidation.parse(req.body);

        //Si la validation est Ok on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

//Middleware de validation des données utilisateur lors d'une update
export const validationUserUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données de l'utilisateur avec Zod
        userUpdateValidation.parse(req.body);

        //Si la validation est Ok on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

//Middleware de validation des données du user lors d'un update par un admin
export const validationUserAdminUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données de l'utilisateur avec Zod
        userAdminUpdateValidation.parse(req.body);

        //Si la validation est Ok on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

//Middleware de validation des données du post
export const validationPostMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du post avec Zod
        postValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};


export const validationPostAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du post avec Zod
        postAdminUpdateValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

//Middleware de validation des données du commentaire
export const validationCommentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du commentaire avec Zod
        commentValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}

export const validationAdminCommentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du commentaire avec Zod
        commentUpdateAdminValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

//Middleware de validation des données du like
export const validationLikeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du like avec Zod
        likeValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
//Middleware de validation des données du follow
export const validationFollowMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du follow avec Zod
        followValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
//Middleware de validation des données du follower
export const validationFollowerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du follower avec Zod
        followerValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
//Middleware de validation des données de l'animal
export const validationAnimalMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données de l'animal avec Zod
        animalValidation.parse(req.body);

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}

//Middleware de validation des données du mot de passe
export const validationResetPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validation des données du password avec Zod
        userResetPasswordValidation.parse({password: req.body.newPassword});

        //Si la validation est OK on passe au middleware suivant
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return APIResponse(res, error.errors, "Formulaire incorrect", 400);
        } else {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}