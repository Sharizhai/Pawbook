import mongoose, { Schema, Types } from "mongoose";
import { IFollower } from "../types/IFollower";

const followerSchema: Schema = new Schema({
    userID: { type: Types.ObjectId, ref: "User", required: true },
    followerUser: { type: Types.ObjectId, ref: "User", required: true },
}, 
{ 
    // Pour le timestamp on ne veut pas récupérer de date de modification donc on précise le updateAt en false.
    timestamps: { createdAt: true, updatedAt: false } 
});

// On ajoute un index composé pour éviter les doublons : un user ne peut être suivi un autre un autre user qu'une seule fois : 
followerSchema.index({ userID: 1, followedUser: 1 }, { unique: true });

export default mongoose.model<IFollower>("Follower", followerSchema);