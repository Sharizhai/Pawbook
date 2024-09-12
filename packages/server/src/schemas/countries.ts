import mongoose, { Schema } from "mongoose";
import { ICountry } from "../types/ICountry";

const countrySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    capital: { type: String, required: true, unique: true  },
    languagesSpoken: { type: Array, required: true},
    continent: { type: String, required: true},
});

export default mongoose.model<ICountry>('Country', countrySchema);