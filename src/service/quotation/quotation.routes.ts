import { Router } from "express";
import { createQuotation, getQuotations, exportQuotation, updateQuotation, deleteQuotation } from "./quotation.controller";
const router = module.exports = Router();

router.post("/", createQuotation);
router.get("/", getQuotations);
router.get("/:quotationId/export", exportQuotation);
router.post("/:quotationId", updateQuotation);
router.delete("/", deleteQuotation);