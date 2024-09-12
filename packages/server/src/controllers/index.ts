import { getLocationsAll, getLocationById, findLocationByCountry, createALocation, deleteLocationById, updateLocation, getPhoto } from "./locationController";
import { getUsers, getUsersById, createAUser, deleteUserById, updateUser, login, logout } from "./userController";
import { getAllCountries, getCountryById, createCountry, deleteCountry, updateCountry } from "./countryController";
import { getAllAccesses, getAccessById, createAccess, deleteAccess, updateAccess, getAccessByCountryId, getAccessByLocationId, getAccessByLocationIdAndCountryId } from "./accessController";
import { uploadPhoto } from "./photoController";

export default {
    "locations" : {
        "get" : getLocationsAll,
        "where" : getLocationById,
        "fromWhere" : findLocationByCountry, 
        "create" : createALocation,
        "delete": deleteLocationById,
        "update": updateLocation,
        "photo" : getPhoto,
    },

    "users" : {
        "get" : getUsers,
        "where" : getUsersById,
        "create" : createAUser,
        "delete": deleteUserById,
        "update": updateUser,
        "login" : login,
        "logout" : logout,
    },

    "accesses" : {
        "get" : getAllAccesses,
        "where" : getAccessById,
        "create" : createAccess,
        "delete": deleteAccess,
        "update": updateAccess,
        "whereCountry" : getAccessByCountryId,
        "whereLocation" : getAccessByLocationId,
        "whereCountryLocation" : getAccessByLocationIdAndCountryId,
    },

    "countries" : {
        "get" : getAllCountries,
        "where" : getCountryById,
        "create" : createCountry,
        "delete": deleteCountry,
        "update": updateCountry,
    },

    "photos" : {
        "upload" : uploadPhoto,
    }
}