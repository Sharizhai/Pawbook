import { Types } from "mongoose";

import User from "../schemas/users";
import { IUser } from "../types/IUser";

//CRUD to get all users
export const getAllUsers = async (): Promise<IUser[]> => {
    try {
        return User.find().select("name firstName email").exec();
    } catch (error : any) {
        console.error(error);
        return error.message;
    }
};

//CRUD to get a user from it's id
export const findUserById = async (id: Types.ObjectId): Promise<{ user: IUser } | null> => {
    try {
        const user = await User.findById(id).select('name firstName email').exec()

        if (!user) 
            return null;
        return {user: user.toObject()};

    } catch (error : any) {
        console.error(error);
        return error.message;
    }
};

//CRUD to create a new user
export const createUser = (user: Partial<IUser>) => {
    try {
        return User.create(user);
    } catch (error : any) {
        console.error(error);
        return error.message;
    }
};

//CRUD to delete a user by it's id
export const deleteUser = (id: Types.ObjectId): Promise<{ deletedCount: number }> => {
    try {
        return User.deleteOne({_id: id});
    } catch (error : any) {
        console.error(error);
        return error.message;
    }
};

//CRUD to update a user by it's id
export const updateUser = async (id: Types.ObjectId, userData: Partial<IUser>) => {
    try {
        return User.findByIdAndUpdate(id, userData, { new: true }).exec();
    } catch (error : any) {
        console.error(error);
        return error.message;
    }
};

//CRUD to get a user by it's credentials
export const findByCredentials = async (email: string): Promise<any> => {
    try {
        return User.findOne({ email }).select("password").exec();
    } catch (err) {
        console.error(err);
        return null;
    }
}