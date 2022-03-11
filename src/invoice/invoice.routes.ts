import { Router } from "express";
import { getInvoices, upsertInvoiceAndExport, deleteInvoice, exportInvoice } from "./invoice.controller";
const router = module.exports = Router();

router.get("/", getInvoices);
router.post("/", upsertInvoiceAndExport);
router.delete("/", deleteInvoice);
router.get("/:invoiceNumber/export", exportInvoice);