import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/IUser";

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true}
});

export default mongoose.model<IUser>('User', userSchema);