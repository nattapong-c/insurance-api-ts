import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, ".env") });

export default {
    EXPRESS_PORT: process.env.EXPRESS_PORT ?? 3000,
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING ?? "",
    DB_NAME: process.env.DB_NAME ?? "test"
};