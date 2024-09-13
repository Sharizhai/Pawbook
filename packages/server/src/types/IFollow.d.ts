import { Document, Types } from "mongoose";

import { IUser } from "./IUser";

export interface IFollow extends Document {
    userID: Types.ObjectId;  // L'utilisateur qui suit
    followedUser: IUser;  // L'utilisateur qui est suivi
    createdAt: Date;
}