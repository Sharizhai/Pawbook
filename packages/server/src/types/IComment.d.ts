import { Document, Types } from "mongoose";

export interface IComment extends Document {
    authorId: Types.ObjectId;
    textContent: string;
}