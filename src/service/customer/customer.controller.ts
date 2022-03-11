import { Request, Response } from "express";
import { Customer, CustomerQuery } from "./customer.model";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as CustomerQuery;
    const response = await Customer.getList(query);
    res.send(response);
}

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    const response = await Customer.create(req.body);
    res.send(response);
}

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    const { customerId } = req.params;
    const response = await Customer.update(customerId, req.body);
    res.send(response);
}


export const deleteCustomer = async (req: Request, res: Response): Promise<any> => {
    const id_list = req.query.id_list as string[];
    if (!id_list) return res.status(400).send("missing id_list");
    var idList: string[] = Array.isArray(id_list) ? id_list : [id_list];
    const response = await Customer.delete(idList);
    res.send(response);
}

export const getCustomerOverview = async (req: Request, res: Response): Promise<any> => {
    const count = await Customer.count();
    return res.send({
        message: "get info success",
        data: {
            count
        }
    });
}