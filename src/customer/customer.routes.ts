import { Router } from "express";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "./customer.controller";
const router = module.exports = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:customerId", updateCustomer);
router.delete("/", deleteCustomer);

