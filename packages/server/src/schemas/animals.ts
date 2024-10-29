import mongoose, { Schema, Types } from "mongoose";
import { IAnimal } from "../types/IAnimal";

const animalSchema: Schema = new Schema({
    ownerId: { type: Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    type: { type: String, required: true },
    picture: { type: String, required: false},
    race: { type: String, required: false },
    age: { type: Number, required: false },
    description: { type: String, required: false},
    likes: [{ type: Types.ObjectId, ref: "Like", required: false }],
    updated: { type: Boolean, default: false }
}, 
{ 
    timestamps: true 
});

animalSchema.pre("save", function(next) {
    if (!this.isNew && this.isModified("textContent")) {
        this.updated = true;
    }
    next();
});

export default mongoose.model<IAnimal>("Animal", animalSchema);