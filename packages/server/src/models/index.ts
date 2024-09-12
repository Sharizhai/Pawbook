import { findAllCountry, findCountryById, createCountry, deleteCountry, updateCountry } from "./countryModel";
import { getAllLocations, findLocationById, findLocationByCountryId, createLocation, deleteLocation, updateLocation } from "./locationsModel";
import { getAllAccesses, findAccessById, findAccessesByCountryId, findAccessesByLocationId, findAccessesByLocationAndCountryId, deleteAccess, updateAccess, createAccess } from "./accessModel";
import { getAllUsers, findUserById, createUser, deleteUser, updateUser, findByCredentials } from "./usersModel";

export default {
    "country" : {
        "get" : findAllCountry,
        "where" : findCountryById,
        "create" : createCountry,
        "delete": deleteCountry,
        "update": updateCountry,
    },
    
    "locations" : {
        "get" : getAllLocations,
        "where" : findLocationById,
        "fromWhere" : findLocationByCountryId, 
        "create" : createLocation,
        "delete": deleteLocation,
        "update": updateLocation,
    },

    "users" : {
        "get" : getAllUsers,
        "where" : findUserById,
        "create" : createUser,
        "delete": deleteUser,
        "update": updateUser,
        "find" : findByCredentials
    },

    "access" : {
        "get" : getAllAccesses,
        "where" : findAccessById,
        "whereCountry" : findAccessesByCountryId,
        "whereLocation" : findAccessesByLocationId,
        "whereCountryLocation" : findAccessesByLocationAndCountryId,
        "create" : createAccess,
        "delete" : deleteAccess,
        "update" : updateAccess,
    }
}