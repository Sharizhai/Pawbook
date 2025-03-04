import mongoose, { Schema, Types } from "mongoose";
import { IFollow } from "../types/IFollow";

const followSchema: Schema = new Schema({
    followerUser: { type: Types.ObjectId, ref: "User", required: true },
    followedUser: { type: Types.ObjectId, ref: "User", required: true },
}, 
{ 
    // Pour le timestamp on ne veut pas récupérer de date de modification donc on précise le updateAt en false.
    timestamps: { createdAt: true, updatedAt: false } 
});

// On ajoute un index composé pour éviter les doublons : un user ne peut suivre un autre un autre user qu'une seule fois : 
followSchema.index({ followerUser: 1, followedUser: 1 }, { unique: true });

export default mongoose.model<IFollow>("Follow", followSchema);