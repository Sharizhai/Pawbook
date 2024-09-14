import mongoose, { Schema } from "mongoose";
import { IUserCredential } from "../types/IUserCredential";

const userCredentialSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
}, {
  timestamps: true
});

export default mongoose.model<IUserCredential>('UserCredential', userCredentialSchema);