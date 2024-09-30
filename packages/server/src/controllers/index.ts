import { getUsers, getUsersById, createAUser, deleteUserById, updateUser, login, logout } from "./userController";
import { getPosts, getPostById, createAPost, deletePostById, updatePost, getPostsByAuthorId } from "./postController";
import { getComments, getCommentById, createAComment, deleteCommentById, updateComment, getCommentsByAuthorId, getCommentsByPostId } from "./commentController";
import { uploadPhoto } from "./photoController";

export default {
    "users" : {
        "get" : getUsers,
        "where" : getUsersById,
        "create" : createAUser,
        "delete": deleteUserById,
        "update": updateUser,
        "login" : login,
        "logout" : logout,
    },

    "posts" : {
        "get" : getPosts,
        "where" : getPostById,
        "create" : createAPost,
        "delete": deletePostById,
        "update": updatePost,
        "getByUserId": getPostsByAuthorId,
    },

    "comments" : {
        "get" : getComments,
        "where" : getCommentById,
        "create" : createAComment,
        "delete": deleteCommentById,
        "update": updateComment,
        "getByUserId": getCommentsByAuthorId,
        "getByPostId": getCommentsByPostId,
    },

    "photos" : {
        "upload" : uploadPhoto,
    }
}