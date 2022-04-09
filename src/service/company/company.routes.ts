import { Router } from "express";
import { handleToken } from "../../middleware/authen";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyOverview,
} from "./company.controller";
const router = (module.exports = Router());

router.get("/info", handleToken, getCompanyOverview);
router.get("/", handleToken, getCompanies);
router.post("/", handleToken, createCompany);
router.put("/:companyId", handleToken, updateCompany);
router.delete("/", handleToken, deleteCompany);
