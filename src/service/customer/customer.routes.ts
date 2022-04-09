import { Router } from "express";
import { handleToken } from "../../middleware/authen";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOverview,
} from "./customer.controller";
const router = (module.exports = Router());

router.get("/info", handleToken, getCustomerOverview);
router.get("/", handleToken, getCustomers);
router.post("/", handleToken, createCustomer);
router.put("/:customerId", handleToken, updateCustomer);
router.delete("/", handleToken, deleteCustomer);
