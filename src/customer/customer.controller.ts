import { Request, Response } from "express";
import { Customer, CustomerQuery } from "./customer.model";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    const { plate_number, page, size } = req.query as CustomerQuery;
    const response = await Customer.getList(plate_number, page, size);
    res.send(response)
}

// export const 
