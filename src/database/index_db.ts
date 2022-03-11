import mongoose, { Model } from "mongoose";
import glob from "glob";
import path from "path";
import { connectDB } from "./mongo";

const indexDB = async () => {
    const files = glob.sync(path.join(__dirname, "../schema/*.ts"));
    try {
        for (let schema of files) {
            let model = require(schema).default;
            await model.ensureIndexes();
        }
        await mongoose.disconnect();
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

(async () => {
    if (require.main === module) {
        await connectDB();
        await indexDB();
    }
})();