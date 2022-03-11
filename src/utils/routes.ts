import { Application } from "express";
import glob from "glob";
import path from "path";
import env from "../config_env";

const routes = (app: Application) => {
    var extension = env.USE_JS ? ".js" : ".ts";

    const files = glob.sync(path.join(__dirname, "../**/*.routes" + extension));
    for (let file of files) {
        app.use("/api/" + path.basename(file, ".routes" + extension), require(file));
    }
}

export default routes;