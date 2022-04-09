import { Request, Response } from "express";
import { JWT } from "../../utils/jwt";
import { User } from "./admin.model";

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "missing email" });

  const user = await User.getByEmail(email);
  if (!user) return res.status(400).send({ error: "user not found" });

  const token = new JWT().jwtSign({ role: user.role, email: user.email });
  return res.send({ data: { token } });
};

export const current = (req: Request, res: Response) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send({ error: "unauthorized" });
  token = token.substring(7);
  try {
    const data = new JWT().jwtVerify(token) as { role: string };
    if (data.role !== "admin") return res.status(401).send({ error: "unauthorized" });

    return res.status(200).send({ data });
  } catch (error) {
    return res.status(401).send({ error: "token expired" });
  }
};
