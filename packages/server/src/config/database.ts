import { connect } from "mongoose";
import { env } from "./env";



const { MONGO_URI } = env;

export const connectDB = async () => {
    try{
        const db = await connect(MONGO_URI);
        console.log(`MongoDB connected: ${db.connection.host}`);
    }
    catch(error : any){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}