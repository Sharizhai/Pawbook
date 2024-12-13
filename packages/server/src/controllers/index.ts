import { getUsers, getUsersById, createAUser, deleteUserById, updateUser, AdminUpdateUser, login, logout, profilUser } from "./userController";
import { getPosts, getPostById, createAPost, deletePostById, updatePost, adminUpdatePost, getPostsByAuthorId, getAdminPostsByAuthorId, getAllPostsAdmin } from "./postController";
import { getComments, getCommentById, createAComment, deleteCommentById, updateComment, updateAdminComment, getCommentsByAuthorId, getAdminCommentsByAuthorId, getCommentsByPostId } from "./commentController";
import { getLikes, getLikeById, createALike, deleteLikeById, getLikesByAuthorId, getLikesByPostId, getLikesByAnimalId } from "./likeController";
import { getFollows, getFollowById, createAFollow, deleteFollowById, getFollowsByAuthorId } from "./followController";
import { getFollowers, getFollowerById, createAFollower, deleteFollowerById, getFollowersByUserId } from "./followerController";
import { getAnimals, getAnimalById, createAnAnimal, deleteAnimalById, updateAnimal, getAnimalsByOwnerId, getAnimalsByCriteria } from "./animalController";
import { uploadPhoto, uploadMultipleFiles, deletePhoto } from "./photoController";
import { forgetPassword, resetPassword } from "./passwordController";

export default {
    "users" : {
        "get" : getUsers,
        "where" : getUsersById,
        "create" : createAUser,
        "delete": deleteUserById,
        "update": updateUser,
        "adminUpdate" : AdminUpdateUser,
        "login" : login,
        "logout" : logout,
        "me" : profilUser,
    },

    "posts" : {
        "get" : getPosts,
        "where" : getPostById,
        "create" : createAPost,
        "delete": deletePostById,
        "update": updatePost,
        "adminUpdate" : adminUpdatePost,
        "getByUserId": getPostsByAuthorId,
        "adminGetByUserId": getAdminPostsByAuthorId,
        "getPostsAdmin": getAllPostsAdmin
    },

    "comments" : {
        "get" : getComments,
        "where" : getCommentById,
        "create" : createAComment,
        "delete": deleteCommentById,
        "update": updateComment,
        "adminUpdate": updateAdminComment,
        "getByUserId": getCommentsByAuthorId,
        "adminGetByUserId": getAdminCommentsByAuthorId,
        "getByPostId": getCommentsByPostId,
    },

    "likes" : {
        "get" : getLikes,
        "where" : getLikeById,
        "create" : createALike,
        "delete": deleteLikeById,
        "getByUserId": getLikesByAuthorId,
        "getByPostId": getLikesByPostId,
        "getByAnimalId": getLikesByAnimalId,
    },

    "follows" : {
        "get" : getFollows,
        "where" : getFollowById,
        "create" : createAFollow,
        "delete": deleteFollowById,
        "getByUserId": getFollowsByAuthorId,
    },

    "followers" : {
        "get" : getFollowers,
        "where" : getFollowerById,
        "create" : createAFollower,
        "delete": deleteFollowerById,
        "getByUserId": getFollowersByUserId,
    },

    "animals" : {
        "get" : getAnimals,
        "where" : getAnimalById,
        "create" : createAnAnimal,
        "delete": deleteAnimalById,
        "update": updateAnimal,
        "getByOwnerId": getAnimalsByOwnerId,
        "getByCriteria": getAnimalsByCriteria
    },

    "photos" : {
        "singleUpload" : uploadPhoto,
        "multipleUpload" : uploadMultipleFiles,
        "delete" : deletePhoto,
    },

    "passwords" : {
        "forget": forgetPassword,
        "reset": resetPassword,
    }
}