import { Document, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    firstname: string;
    email: string;
    password: string;
    role: string;
}