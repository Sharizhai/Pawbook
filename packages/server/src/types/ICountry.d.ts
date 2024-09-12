import { Document, Types } from "mongoose";

export interface ICountry extends Document {
    id: Types.ObjectId;
    name: string;
    capital: string;
    languagesSpoken: string;
    continent: string;
}