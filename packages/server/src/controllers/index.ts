import { getUsers, getUsersById, createAUser, deleteUserById, updateUser, login, logout, profilUser } from "./userController";
import { getPosts, getPostById, createAPost, deletePostById, updatePost, getPostsByAuthorId } from "./postController";
import { getComments, getCommentById, createAComment, deleteCommentById, updateComment, getCommentsByAuthorId, getCommentsByPostId } from "./commentController";
import { getLikes, getLikeById, createALike, deleteLikeById, getLikesByAuthorId, getLikesByPostId, getLikesByAnimalId } from "./likeController";
import { getFollows, getFollowById, createAFollow, deleteFollowById, getFollowsByAuthorId } from "./followController";
import { getFollowers, getFollowerById, createAFollower, deleteFollowerById, getFollowersByUserId } from "./followerController";
import { getAnimals, getAnimalById, createAnAnimal, deleteAnimalById, updateAnimal, getAnimalsByOwnerId, getAnimalsByCriteria } from "./animalController";
import { uploadPhoto, uploadMultipleFiles } from "./photoController";

export default {
    "users" : {
        "get" : getUsers,
        "where" : getUsersById,
        "create" : createAUser,
        "delete": deleteUserById,
        "update": updateUser,
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
        "getByUserId": getPostsByAuthorId
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
        "multipleUpload" : uploadMultipleFiles
    }
}