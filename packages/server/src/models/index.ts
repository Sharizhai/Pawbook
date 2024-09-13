import { getAllUsers, findUserById, createUser, deleteUser, updateUser, findByCredentials } from "./usersModel";

export default {
    "users" : {
        "get" : getAllUsers,
        "where" : findUserById,
        "create" : createUser,
        "delete": deleteUser,
        "update": updateUser,
        "find" : findByCredentials
    },
}