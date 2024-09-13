import { Document, Types } from "mongoose";

export interface IAnimal extends Document {
    ownerId: Types.ObjectId;
    name: string;
    picture?: string;
    race?: string;
    age?: number;
    description?: string;
    likes?: ILike[];
}