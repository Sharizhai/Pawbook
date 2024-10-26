import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
//import { singleUpload, updateEntityWithPhotoInfo } from "./photoMiddleware";
import { validationUserMiddleware, validationPostMiddleware, validationCommentMiddleware, validationLikeMiddleware, validationFollowMiddleware, validationFollowerMiddleware, validationAnimalMiddleware } from "./controlMiddleware";
import { authenticationMiddleware, authenticationMiddlewareToObject, isAdmin } from "./authenticationMiddleware";

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    //"upload" : upload,
    //"storageEntity" : updateEntityWithPhotoInfo,
    "validationUser" : validationUserMiddleware,
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