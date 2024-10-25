import { Document, Types } from "mongoose";

import { IUser } from "./IUser";

export interface IFollow extends Document {
    followerUser: Types.ObjectId;  // L'utilisateur qui suit
    followedUser: Types.ObjectId;  // L'utilisateur qui est suivi
    createdAt: Date;
}