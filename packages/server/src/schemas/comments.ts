import mongoose, { Schema } from "mongoose";
import { IComment } from "../types/IComment";

const commentSchema: Schema = new Schema({
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    textContent: { type: String, required: true },
    updated: { type: Boolean, default: false }
}, {
    timestamps: true
});

commentSchema.pre("save", function(next) {
    if (!this.isNew && this.isModified("textContent")) {
        this.updated = true;
    }
    next();
});

export default mongoose.model<IComment>("Comment", commentSchema);