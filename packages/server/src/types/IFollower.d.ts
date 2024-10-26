import { Document, Types } from "mongoose";

import { IUser } from "./IUser";

export interface IFollower extends Document {
    followedUser: Types.ObjectId;  // L'utilisateur qui est suivi
    followerUser: Types.ObjectId;  // L'utilisateur qui suit
    createdAt: Date;
}