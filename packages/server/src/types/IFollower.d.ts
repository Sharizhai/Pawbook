import { Document, Types } from "mongoose";

import { IUser } from "./IUser";

export interface IFollower extends Document {
    userID: Types.ObjectId;  // L'utilisateur qui est suivi
    followerUser: IUser;  // L'utilisateur qui suit
    createdAt: Date;
}