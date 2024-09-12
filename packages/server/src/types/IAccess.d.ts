import { Document, Types } from "mongoose";

export interface IAccess extends Document {
    idLocation: Types.ObjectId;
    idCountry: Types.ObjectId;
    type: string;
}