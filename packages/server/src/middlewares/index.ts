import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
import { upload, updateLocationWithPhotoInfo } from "./photoMiddleware";
import { validationUserMiddleware, validationPostMiddleware, validationCommentMiddleware, validationLikeMiddleware, validationFollowMiddleware, validationFollowerMiddleware, validationAnimalMiddleware } from "./controlMiddleware";
import { authMiddleware, isAdmin } from "./authenticationMiddleware";

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    "storage" : upload,
    "storageLocation" : updateLocationWithPhotoInfo,
    "validationUser" : validationUserMiddleware,
    "validationPost" : validationPostMiddleware,
    "validationComment" : validationCommentMiddleware,
    "validationLike" : validationLikeMiddleware,
    "validationFollow" : validationFollowMiddleware,
    "validationFollower" : validationFollowerMiddleware,
    "validationAnimal" : validationAnimalMiddleware,
    "auth" : authMiddleware,
    "isAdmin" : isAdmin
}