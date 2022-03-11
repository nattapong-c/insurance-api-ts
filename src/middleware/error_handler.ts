import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { Error400 } from "../utils/error";

const handler = (err: ErrorRequestHandler, req: Request, res: Response, nex: NextFunction) => {
    if (err instanceof Error400) {
        return res.status(400).send({ error: err.message, data: err });
    }
    res.status(500).send({ error: "Unhandled!", data: err.toString() });
};
export default handler;