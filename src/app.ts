require("express-async-errors");

import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import env from "./config_env";
import routes from './utils/routes';
import { connectDB } from "./database/mongo";
import errorHandler from "./middleware/error_handler";
import cors from "cors";

const app: Application = express();
const PORT: any = env.EXPRESS_PORT;

connectDB();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000", "https://car-insurance-tools.web.app"] }));

app.get("/health", (req: Request, res: Response) => {
    res.send({ message: "server running" });
});
routes(app);

// error
app.use((req: Request, res: Response, next: NextFunction) => res.status(404).send({ error: "page not found" }));
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running ${PORT}`);
});