import { Router } from "express";
import { handleToken } from "../../middleware/authen";
import {
  getInvoices,
  upsertInvoiceAndExport,
  deleteInvoice,
  exportInvoice,
  getInvoiceOverview,
} from "./invoice.controller";
const router = (module.exports = Router());

router.get("/info", handleToken, getInvoiceOverview);
router.get("/", handleToken, getInvoices);
router.post("/", handleToken, upsertInvoiceAndExport);
router.delete("/", handleToken, deleteInvoice);
router.get("/:invoiceNumber/export", handleToken, exportInvoice);
