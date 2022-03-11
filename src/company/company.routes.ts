import { Router } from "express";
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompanyOverview } from "./company.controller";
const router = module.exports = Router();

router.get("/info", getCompanyOverview);
router.get("/", getCompanies);
router.post("/", createCompany);
router.put("/:companyId", updateCompany);
router.delete("/", deleteCompany);