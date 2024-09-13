import { Document, Types } from "mongoose";

export interface IPost extends Document {
    authorId: Types.ObjectId;
    textContent: string;
    photoContent: string[];   
    likes?: ILike[];
    comments?: IComment[];
}