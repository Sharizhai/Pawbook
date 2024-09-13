import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/IUser";

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "ADMIN"], required: true },
    profilePicture: { type: String, required: false},
    profileDescription: { type: String, required: false},
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", required: false }],
    animals: [{ type: Schema.Types.ObjectId, ref: "Animal", required: false }],
    follows: [{ type: Schema.Types.ObjectId, ref: "Follow", required: false }],
    followers: [{ type: Schema.Types.ObjectId, ref: "Follower", required: false }]
}, 
{ 
    timestamps: true 
});

export default mongoose.model<IUser>('User', userSchema);