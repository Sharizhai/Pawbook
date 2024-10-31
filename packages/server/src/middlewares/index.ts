import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
import { uploadFiles } from "./photoMiddleware";
import { validationUserMiddleware, validationUserUpdateMiddleware, validationPostMiddleware, validationCommentMiddleware, validationLikeMiddleware, validationFollowMiddleware, validationFollowerMiddleware, validationAnimalMiddleware } from "./controlMiddleware";
import { authenticationMiddleware, authenticationMiddlewareToObject, isAdmin } from "./authenticationMiddleware";

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    "upload" : uploadFiles,
    "validationUser" : validationUserMiddleware,
    "validationUserUpdate" : validationUserUpdateMiddleware,
    "validationPost" : validationPostMiddleware,
    "validationComment" : validationCommentMiddleware,
    "validationLike" : validationLikeMiddleware,
    "validationFollow" : validationFollowMiddleware,
    "validationFollower" : validationFollowerMiddleware,
    "validationAnimal" : validationAnimalMiddleware,
    "authentication" : authenticationMiddleware,
    "authenticationToObject" : authenticationMiddlewareToObject,
    "isAdmin" : isAdmin
}