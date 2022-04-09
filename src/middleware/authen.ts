import { Request, Response, NextFunction } from "express";
import { JWT } from "../utils/jwt";

export const handleToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send({ error: "unauthorized" });
  token = token.substring(7);
  try {
    const data = new JWT().jwtVerify(token) as { role: string };
    if (data.role !== "admin") return res.status(401).send({ error: "unauthorized" });
  } catch (error) {
    return res.status(401).send({ error: "token expired" });
  }
  next();
};
