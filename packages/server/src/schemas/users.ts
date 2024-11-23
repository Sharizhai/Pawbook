import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../types/IUser";

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "ADMIN"], required: true },
    profilePicture: { type: String, required: false},
    profileDescription: { type: String, required: false},
    posts: [{ type: Types.ObjectId, ref: "Post", required: false }],
    animals: [{ type: Types.ObjectId, ref: "Animal", required: false }],
    follows: [{ type: Types.ObjectId, ref: "Follow", required: false }],
    followers: [{ type: Types.ObjectId, ref: "Follow", required: false }],
    refreshToken: { type: String, required: false},
}, 
{ 
    timestamps: true 
});

export default mongoose.model<IUser>('User', userSchema);