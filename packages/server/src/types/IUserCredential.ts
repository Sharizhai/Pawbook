import { Document } from "mongoose";

export interface IUserCredential extends Document {
    email: string;
    password: string;
}