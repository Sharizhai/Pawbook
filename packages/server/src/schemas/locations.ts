import mongoose, { Schema, Types } from "mongoose";
import { ILocation } from "../types/ILocation";

const locationSchema: Schema = new Schema({
    name: { type: String, required: true },
    freeEntry: { type: Boolean, required: true },
    price: { type: Number, required: true,},
    type : { type: String, required: true},
    photoName: { type: String},
    photoType: { type: String},
    countryId: { type: Types.ObjectId, ref: 'Country', required: true },
});

export default mongoose.model<ILocation>('Location', locationSchema);