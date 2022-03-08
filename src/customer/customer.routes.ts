import { Router } from "express";
import { getCustomers } from "./customer.controller";
const router = module.exports = Router();

router.get("/", getCustomers);

