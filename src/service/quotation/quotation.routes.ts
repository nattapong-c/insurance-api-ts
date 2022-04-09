import { Router } from "express";
import { handleToken } from "../../middleware/authen";
import {
  createQuotation,
  getQuotations,
  exportQuotation,
  updateQuotation,
  deleteQuotation,
} from "./quotation.controller";
const router = (module.exports = Router());

router.post("/", handleToken, createQuotation);
router.get("/", handleToken, getQuotations);
router.get("/:quotationId/export", handleToken, exportQuotation);
router.post("/:quotationId", handleToken, updateQuotation);
router.delete("/", handleToken, deleteQuotation);
