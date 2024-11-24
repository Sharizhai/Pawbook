import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
import { uploadFiles } from "./photoMiddleware";
import { validationUserMiddleware, validationUserUpdateMiddleware, validationUserAdminUpdateMiddleware, validationPostMiddleware, validationCommentMiddleware, validationLikeMiddleware, validationFollowMiddleware, validationFollowerMiddleware, validationAnimalMiddleware } from "./controlMiddleware";
import { authenticationMiddleware, isAdmin } from "./authenticationMiddleware";
import { refreshTokenMiddleware } from "./refreshTokenMiddleware"

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    "upload" : uploadFiles,
    "validationUser" : validationUserMiddleware,
    "validationUserUpdate" : validationUserUpdateMiddleware,
    "validationUserAdminUpdate" : validationUserAdminUpdateMiddleware,
    "validationPost" : validationPostMiddleware,
    "validationComment" : validationCommentMiddleware,
    "validationLike" : validationLikeMiddleware,
    "validationFollow" : validationFollowMiddleware,
    "validationFollower" : validationFollowerMiddleware,
    "validationAnimal" : validationAnimalMiddleware,
    "authentication" : authenticationMiddleware,
    "isAdmin" : isAdmin,
    "refreshToken" : refreshTokenMiddleware
}