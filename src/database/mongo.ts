import env from "../config_env";
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGO_CONNECTION_STRING,
            {
                autoIndex: false,
                dbName: env.DB_NAME
            }
        );
    } catch (err: any) {
        throw new Error(err);
    }
};