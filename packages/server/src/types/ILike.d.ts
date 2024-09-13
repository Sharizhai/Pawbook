import { Document, Types } from "mongoose";

export interface ILike extends Document {
    authorId: Types.ObjectId;
}