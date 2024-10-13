import { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { IUser } from "../types/IUser";
import User from "../schemas/users";

//CRUD to get all users
export const getAllUsers = async (response: Response): Promise<IUser[]> => {
  try {
    const users = await User.find().select("name firstName email").exec();

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
      .populate('follows')
      .populate('followers')
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
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return null;
    }

    return deletedUser;
  } catch (error) {
    console.error(error);
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