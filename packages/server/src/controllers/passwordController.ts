import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from 'express';
import Model from "../models/index";
import { Types } from "mongoose";

import { APIResponse, logger, sendResetPasswordEmail, hashPassword } from "../utils";
import { userResetPasswordValidation } from "../validation/validation";
import { IUser } from "../types/IUser";
import User from "../schemas/users";
import { env } from "../config/env";

const { JWT_RESET_PWD_SECRET } = env;

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const forgetPassword = async (request: Request, response: Response) => {
  try {
    // On retrouve l'utilisateur à l'aide de son adresse mail
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      //On renvoie une réponse 200 même si on ne trouve pas l'user (+ secure)
      return APIResponse(response, null, "Si cette adresse existe, vous recevrez un e-mail de réinitialisation.", 200);
    }

    // On génère un token JWT avec une expiration d'une heure
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_RESET_PWD_SECRET, { expiresIn: "1h" });

    // On crée le lien de réinitialisation du mot de passe
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // On envoie l'email de réinitialisation du mot de passe
    await sendResetPasswordEmail(request.body.email, resetLink);

    return APIResponse(response, null, "Si cette adresse existe, vous recevrez un e-mail de réinitialisation.", 200);

  } catch (error: any) {
    APIResponse(response, null, error.message, 500);
  }
};

export const resetPassword = async (request: Request, response: Response) => {
  try {

    // On valide les données utilisateur avec le schéma Zod fourni afin de s'assure que les données soient bonnes
    const validatedPassword = userResetPasswordValidation.parse({ password: request.body.newPassword });

    // On vérifie le token envoyé par l'utilisateur
    const decodedToken = jwt.verify(
      request.params.token,
      JWT_RESET_PWD_SECRET
    ) as CustomJwtPayload;

    const userId = decodedToken.userId;

    // Si le token n'est pas valide on renvoie une erreur
    if (!userId) {
      return APIResponse(response, null, "Token non valide", 401);
    }

    // On retrouve l'utilisateur à l'aide de son id
    const user = await Model.users.where(new Types.ObjectId(userId), response);

    if (!user) {
      return APIResponse(response, null, "Utilisateur non trouvé", 401);
    }

    // On hash le nouveau mot de passe
    const hashedPassword = await hashPassword(validatedPassword.password);

    if (!hashedPassword) {
      logger.error("Erreur lors du hashage du mot de passe");
      return APIResponse(response, null, "Erreur lors du hashage du mot de passe", 500);
    }

    // On crée un objet partiel d'IUser pour la mise à jour
    const updatedData: Partial<IUser> = {
      password: hashedPassword
    };

    const updatedUser = await Model.users.update(
      new Types.ObjectId(userId),
      updatedData,
      response
    );

    if (!updatedUser) {
      return APIResponse(response, null, "Utilisateur non trouvé", 404);
    }

    logger.info("Utilisateur mis à jour avec succès");
    return APIResponse(response, updatedUser, "Utilisateur mis à jour avec succès", 200);
  } catch (err: any) {
    return APIResponse(response, null, "Erreur lors de la réinitialisation du mot de passe", 500);
  }
};