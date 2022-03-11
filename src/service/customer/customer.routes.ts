import { Router } from "express";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomerOverview } from "./customer.controller";
const router = module.exports = Router();

router.get("/info", getCustomerOverview);
router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:customerId", updateCustomer);
router.delete("/", deleteCustomer);

