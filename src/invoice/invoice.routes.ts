import { Router } from "express";
import { getInvoices, upsertInvoiceAndExport, deleteInvoice, exportInvoice, getInvoiceOverview } from "./invoice.controller";
const router = module.exports = Router();

router.get("/info", getInvoiceOverview);
router.get("/", getInvoices);
router.post("/", upsertInvoiceAndExport);
router.delete("/", deleteInvoice);
router.get("/:invoiceNumber/export", exportInvoice);