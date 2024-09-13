import { Document, Types } from "mongoose";

export interface IFollow extends Document {
    userID: Types.ObjectId;  // L'utilisateur qui suit
    followedUserID: Types.ObjectId;  // L'utilisateur qui est suivi
    createdAt: Date;
}