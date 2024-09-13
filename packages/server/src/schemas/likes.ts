import mongoose, { Schema } from "mongoose";
import { ILike } from "../types/ILike";

const likeSchema: Schema = new Schema({
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<ILike>("Like", likeSchema);