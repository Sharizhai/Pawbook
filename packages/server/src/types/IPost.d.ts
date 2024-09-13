import { Document, Types } from "mongoose";

import { ILike } from "./ILike";
import { IComment } from "./IComment";

export interface IPost extends Document {
    authorId: Types.ObjectId;
    textContent?: string;
    photoContent?: string[];   
    likes: ILike[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
    updated?: Boolean;
}