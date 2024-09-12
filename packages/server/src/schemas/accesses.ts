import mongoose, { Schema, Types } from "mongoose";
import { IAccess } from "../types/IAccess";

const accessSchema: Schema = new Schema({
    locationId: { type: Types.ObjectId, required: true, ref: 'Location'  },
    countryId: { type: Types.ObjectId, required: true, ref: 'Country'  },
    category: { type: String, required: true}
});

export default mongoose.model<IAccess>('Access', accessSchema);