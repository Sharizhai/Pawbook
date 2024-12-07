import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
import { uploadFiles } from "./photoMiddleware";
import { validationUserMiddleware, validationUserUpdateMiddleware, validationUserAdminUpdateMiddleware, validationPostMiddleware, validationCommentMiddleware, validationAdminCommentMiddleware,  validationLikeMiddleware, validationFollowMiddleware, validationFollowerMiddleware, validationAnimalMiddleware, validationPostAdminMiddleware, validationResetPasswordMiddleware } from "./controlMiddleware";
import { authenticationMiddleware, isAdmin, verifyIdentity } from "./authenticationMiddleware";
import { refreshTokenMiddleware } from "./refreshTokenMiddleware"

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    "upload" : uploadFiles,
    "validationUser" : validationUserMiddleware,
    "validationUserUpdate" : validationUserUpdateMiddleware,
    "validationUserAdminUpdate" : validationUserAdminUpdateMiddleware,
    "validationPost" : validationPostMiddleware,
    "validationPostAdmin" : validationPostAdminMiddleware,
    "validationComment" : validationCommentMiddleware,
    "validationCommentAdmin" : validationAdminCommentMiddleware,
    "validationLike" : validationLikeMiddleware,
    "validationFollow" : validationFollowMiddleware,
    "validationFollower" : validationFollowerMiddleware,
    "validationAnimal" : validationAnimalMiddleware,
    "authentication" : authenticationMiddleware,
    "isAdmin" : isAdmin,
    "refreshToken" : refreshTokenMiddleware,
    "identityVerification" : verifyIdentity, 
    "validationResetPassword" : validationResetPasswordMiddleware
}