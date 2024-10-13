import mongoose, { Schema, Types } from "mongoose";
import { IPost } from "../types/IPost";

const postSchema: Schema = new Schema({
    authorId: { type: Types.ObjectId, ref: "User", required: true },
    textContent: { type: String, required: false },
    photoContent: [{ type: String, required: false }],
    likes: [{ type: Types.ObjectId, ref: "Like", required: false }],
    comments: [{ type: Types.ObjectId, ref: "Comment", required: false }],
    updated: { type: Boolean, default: false }
}, {
    timestamps: true
});

postSchema.pre("save", function(next) {
    if (!this.isNew && (this.isModified("textContent") || this.isModified("photoContent"))) {
        this.updated = true;
    }
    next();
});

export default mongoose.model<IPost>("Post", postSchema);