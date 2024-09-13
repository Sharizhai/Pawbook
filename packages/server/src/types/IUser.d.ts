import { Document, Types } from "mongoose";

import { IPost } from "./IPost";
import { IAnimal } from "./IAnimal";
import { IFollow } from "./IFollow";
import { IFollower } from "./IFollower";

export interface IUser extends Document {
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    profilePicture?: string;
    profileDescription?: string;
    posts: IPost[];
    animals: IAnimal[];
    follows: IFollow[];
    followers: IFollower[];
    createdAt: Date;
    updatedAt: Date;
}