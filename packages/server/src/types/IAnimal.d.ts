import { Document, Types } from "mongoose";

import { ILike } from "./ILike";

export interface IAnimal extends Document {
    ownerId: Types.ObjectId;
    name: string;
    picture?: string;
    race?: string;
    age?: number;
    description?: string;
    likes: ILike[];
    createdAt: Date;
    updatedAt: Date;
    updated?: Boolean;
}