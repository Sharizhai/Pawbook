import { loggerMiddleware } from "./loggerMiddleware";
import { errorModule } from "./errorMiddleware";
import { upload, updateLocationWithPhotoInfo } from "./photoMiddleware";
import { 
    validationLocationMiddleware, 
    validationUserMiddleware, 
    validationAccessMiddleware, 
    validationCountriesMiddleware,
  } from "./controlMiddleware";
import { authMiddleware, isAdmin } from "./authMiddleware";

export default {
    "error" : errorModule,
    "logger" : loggerMiddleware,
    "storage" : upload,
    "storageLocation" : updateLocationWithPhotoInfo,
    "validationLocation" : validationLocationMiddleware,
    "validationUser" : validationUserMiddleware,
    "validationAccess" : validationAccessMiddleware,
    "validationCountries" : validationCountriesMiddleware,
    "auth" : authMiddleware,
    "isAdmin" : isAdmin
}