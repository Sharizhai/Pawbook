import { Document, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    profilePicture: string;
    profileDescription: string;
    posts?: IPost[];
    animals?: IAnimal[];
    follows?: IFollow[];
    followers?: IFollower[];
}