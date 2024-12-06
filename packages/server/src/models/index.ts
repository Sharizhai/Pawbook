import { getAllUsers, findUserById, createUser, deleteUser, updateUser, findByCredentials } from "./usersModel";
import { getAllPosts, findPostById, createPost, deletePost, updatePost, findPostsByAuthorId, findAdminPostsByAuthorId } from "./postsModel";
import { getAllComments, findCommentById, createComment, deleteComment, updateComment, findCommentsByAuthorId, findCommentsByPostId } from "./commentsModel";
import { getAllLikes, findLikeById, createLike, deleteLike, findLikesByAuthorId, findLikesByPostId, findLikesByAnimalId } from "./likesModel";
import { getAllFollows, findFollowByFollowerId, createFollow, deleteFollow, findFollowsByUserId } from "./followsModel";
import { getAllFollowers, findFollowerByFollowedUserId, createFollower, deleteFollower, findFollowersByUserId } from "./followersModel";
import { getAllAnimals, findAnimalById, createAnimal, deleteAnimal, updateAnimal, findAnimalsByOwnerId, findAnimalsByCriteria } from "./animalsModel";

export default {
    "users": {
        "get": getAllUsers,
        "where": findUserById,
        "create": createUser,
        "delete": deleteUser,
        "update": updateUser,
        "findWithCredentials": findByCredentials
    },
    "posts": {
        "get": getAllPosts,
        "where": findPostById,
        "create": createPost,
        "delete": deletePost,
        "update": updatePost,
        "findByAuthor": findPostsByAuthorId,
        "adminFindByAuthor": findAdminPostsByAuthorId
    },
    "comments": {
        "get": getAllComments,
        "where": findCommentById,
        "create": createComment,
        "delete": deleteComment,
        "update": updateComment,
        "findByAuthor": findCommentsByAuthorId,
        "findByPost": findCommentsByPostId
    },
    "likes": {
        "get": getAllLikes,
        "where": findLikeById,
        "create": createLike,
        "delete": deleteLike,
        "findByAuthor": findLikesByAuthorId,
        "findByPost": findLikesByPostId,
        "findByAnimal": findLikesByAnimalId
    },
    "follows": {
        "get": getAllFollows,
        "where": findFollowByFollowerId,
        "create": createFollow,
        "delete": deleteFollow,
        "findByUser": findFollowsByUserId
    },
    "followers": {
        "get": getAllFollowers,
        "where": findFollowerByFollowedUserId,
        "create": createFollower,
        "delete": deleteFollower,
        "findByUser": findFollowersByUserId
    },
    "animals": {
        "get": getAllAnimals,
        "where": findAnimalById,
        "create": createAnimal,
        "delete": deleteAnimal,
        "update": updateAnimal,
        "findByOwner": findAnimalsByOwnerId,
        "findByCriteria": findAnimalsByCriteria
    }
};