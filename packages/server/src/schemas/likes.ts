import mongoose, { Schema, Types } from "mongoose";
import { ILike } from "../types/ILike";

const likeSchema: Schema = new Schema({
    authorId: { type: Types.ObjectId, ref: "User", required: true },
    postId: { type: Types.ObjectId, required: false, ref: "Post" },
    animalId: { type: Types.ObjectId, required: false, ref: "Animal" },
}, {
    timestamps: true,
});

likeSchema.pre("validate", function (next) {
    if ((this.postId === undefined || this.postId === null) &&
        (this.animalId === undefined || this.animalId === null)) {
        this.invalidate("postIdOrAnimalId", "le postId ou l'animalId doit être fournit");
    } else if (this.postId && this.animalId) {
        this.invalidate("postIdOrAnimalId", "Seulement le postId ou l'animalId doit être fournit, pas les deux ensemble");
    }
    next();
});

export default mongoose.model<ILike>("Like", likeSchema);