import { Router } from "express";
import { login, current } from "./admin.controller";
import { handleToken } from "../../middleware/authen";

const router = (module.exports = Router());

router.post("/login", login);
router.get("/current", handleToken, current);
