import { z } from "zod";
import { Response } from "express";
import mongoose, { Types } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import { IUser } from "../types/IUser";
import User from "../schemas/users";
import Post from "../schemas/posts";
import Comment from "../schemas/comments";
import Like from "../schemas/likes";

//CRUD to get all users
export const getAllUsers = async (response: Response): Promise<IUser[]> => {
  try {
    const users = await User.find().select("name firstName email profilePicture profileDescription role posts animals follows followers")
      .populate('posts')
      .populate('animals')
      .populate({
        path: 'follows',
        populate: {
          path: 'followedUser',
          select: 'name firstName profilePicture', // Informations du user suivi
        },
      })
      .populate({
        path: 'followers',
        populate: {
          path: 'followerUser',
          select: 'name firstName profilePicture', // Informations du follower
        },
      })
      .exec();

    return users;
  } catch (error) {
    console.error(error);

    return [];
  }
};

//CRUD to get a user from it's id
export const findUserById = async (id: Types.ObjectId, response: Response): Promise<{ user: IUser } | null> => {
  try {
    const user = await User.findById(id)
      .select("name firstName email profilePicture profileDescription role posts animals follows followers")
      .populate('posts')
      .populate('animals')
      .populate({
        path: 'follows',
        populate: {
          path: 'followedUser',
          select: 'name firstName profilePicture', // Informations du user suivi
        },
      })
      .populate({
        path: 'followers',
        populate: {
          path: 'followerUser',
          select: 'name firstName profilePicture', // Informations du follower
        },
      })
      .exec();

    if (!user) {
      return null;
    }

    const result = { user: user.toObject() };

    return result;
  } catch (error: any) {
    console.error(error);

    return null;
  }
};

//CRUD to create a new user
export const createUser = async (user: Partial<IUser>, response: Response): Promise<IUser | null> => {
  try {
    const newUser = await User.create(user);

    return newUser;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

//CRUD to delete a user by it's id
export const deleteUser = async (id: Types.ObjectId, response: Response): Promise<IUser | null> => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Post.deleteMany({ authorId: id }).session(session);
      await Comment.deleteMany({ authorId: id }).session(session);
      await Like.deleteMany({ authorId: id }).session(session);

      const deletedUser = await User.findOneAndDelete({ _id: id }).session(session);

      if (!deletedUser) {
        await session.abortTransaction();
        return null;
      }

      await session.commitTransaction();

      // On supprime la pphoto de prfil sur Cloudinary
      if (deletedUser.profilePicture) {
        try {
          const photoId = deletedUser.profilePicture.split('/').pop()?.split('.')[0];
          const cloudinaryPublicId = `pawbook/uploads/${photoId}`;
          await cloudinary.uploader.destroy(cloudinaryPublicId);
        } catch (error) {
          console.error('Erreur lors de la suppression de la photo de profil:', error);
        }
      }

      // On supprime également les images des posts de l'user sur Cloudinary
      if (deletedUser.posts.length > 0) {
        const results = await Promise.allSettled(
          deletedUser.posts.flatMap(post =>
            (post.photoContent || []).map((imageUrl) => {
              try {
                const photoId = imageUrl.split('/').pop()?.split('.')[0];
                const cloudinaryPublicId = `pawbook/uploads/${photoId}`;
                return cloudinary.uploader.destroy(cloudinaryPublicId);
              } catch (error) {
                console.error('Erreur lors de la suppression de l\'image:', imageUrl, error);
                throw error;
              }
            })
          )
        );
      }

      return deletedUser;
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      return null;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur et des données associées:", error);
    return null;
  }
};

//CRUD to update a user by it's id
export const updateUser = async (id: Types.ObjectId, userData: Partial<IUser>, response: Response): Promise<IUser | null> => {
  try {

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      userData,
      { new: true }
    ).exec();

    if (!updatedUser) {
      return null;
    }

    return updatedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//CRUD to get a user by it's credentials
// On fait d'abord un schéma Zod pour la validation de l'email
const EmailSchema = z.string().email();

export const findByCredentials = async (email: string): Promise<any> => {
  try {

    const validatedEmail = EmailSchema.parse(email.toLowerCase());
    const user = await User.findOne({ email: validatedEmail }).select("password").exec();

    if (!user) {
      return null;
    }
    return user;

  } catch (err) {
    console.error("Error in findByCredentials:", err);
    return null;
  }
};