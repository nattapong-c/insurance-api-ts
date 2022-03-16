import { Router } from "express";
import { createQuotation, getQuotations } from "./quotation.controller";
const router = module.exports = Router();

router.post("/", createQuotation);
router.get("/", getQuotations);