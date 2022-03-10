import { Application } from "express";
import glob from "glob";
import path from "path";

const routes = (app: Application) => {
    const files = glob.sync(path.join(__dirname, "../**/*.routes.ts"));
    for (let file of files) {
        app.use("/api/" + path.basename(file, ".routes.ts"), require(file))
    }
}

export default routes;