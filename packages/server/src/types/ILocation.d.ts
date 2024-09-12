import { Document, Types } from "mongoose";

export interface ILocation extends Document {
    countryId: Types.ObjectId;
    name: string;
    freeEntry: boolean;
    price: number;
    type: string; 
    photoName: string;
    photoType: string;
}