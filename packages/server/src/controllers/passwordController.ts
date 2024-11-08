import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from 'express';
import Model from "../models/index";
import { Types } from "mongoose";

import { APIResponse, logger, sendResetPasswordEmail, hashPassword } from "../utils";
import { userResetPasswordValidation } from "../validation/validation";
import { IUser } from "../types/IUser";
import User from "../schemas/users";

export const forgetPassword = async (request: Request, response: Response) => {
  try {
    // On retrouve l'utilisateur à l'aide de son adresse mail
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      //On renvoie une réponse 200 même si on ne trouve pas l'user (+ secure)
      return APIResponse(response, null, "Si cette adresse existe, vous recevrez un e-mail de réinitialisation.", 200);
    }

    const secret = process.env.JWT_RESET_PWD_SECRET;
    console.log('Secret used for JWT:', secret); // Pour déboguer

    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    // On génère un token JWT avec une expiration d'une heure
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "1h" }
    );

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
    // On valide le mdp avec le schéma Zod fourni afin de s'assurer que les données soient bonnes
    const validatedPassword = userResetPasswordValidation.parse({
      password: request.body.newPassword
    });

    // On vérifie que le secret existe
    const secret = process.env.JWT_RESET_PWD_SECRET;
    if (!secret) {
      throw new Error('JWT_RESET_PWD_SECRET is not defined');
    }

    // On vérifie le token
    const decodedToken = jwt.verify(
      request.params.token,
      secret
    ) as JwtPayload & { id: string; email: string };

    // On vérifie que le token contient bien un id
    if (!decodedToken.id) {
      return APIResponse(response, null, "Token non valide", 401);
    }

    const user = await Model.users.where(new Types.ObjectId(decodedToken.id), response);

    if (!user) {
      return APIResponse(response, null, "Utilisateur non trouvé", 401);
    }

    // On hash le nouveau mot de passe
    const hashedPassword = await hashPassword(validatedPassword.password);
    if (!hashedPassword) {
      logger.error("Erreur lors du hashage du mot de passe");
      return APIResponse(response, null, "Erreur lors du hashage du mot de passe", 500);
    }

    // On met à jour le nouveau mot de passe
    const updatedData: Partial<IUser> = {
      password: hashedPassword
    };

    const updatedUser = await Model.users.update(
      new Types.ObjectId(decodedToken.id),
      updatedData,
      response
    );

    if (!updatedUser) {
      return APIResponse(response, null, "Utilisateur non trouvé", 404);
    }

    logger.info("Utilisateur mis à jour avec succès");
    return APIResponse(response, updatedUser, "Utilisateur mis à jour avec succès", 200);

  } catch (err: any) {
    console.error(err);
    return APIResponse(response, null, `Erreur lors de la réinitialisation du mot de passe: ${err.message}`, 500 );
  }
};