import { Request, Response } from "express";
import { Company, CompanyQuery } from "./company.model";

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as CompanyQuery;
    const response = await Company.getList(query);
    res.send(response);
}

export const createCompany = async (req: Request, res: Response): Promise<void> => {
    const response = await Company.create(req.body);
    res.send(response);
}

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const response = await Company.update(companyId, req.body);
    res.send(response);
}

export const deleteCompany = async (req: Request, res: Response): Promise<any> => {
    const id_list = req.query.id_list as string[];
    if (!id_list) return res.status(400).send("missing id_list");
    var idList: string[] = Array.isArray(id_list) ? id_list : [id_list];
    const response = await Company.delete(idList);
    res.send(response);
}

export const getCompanyOverview = async (req: Request, res: Response): Promise<any> => {
    const count = await Company.count();
    return res.send({
        message: "get info success",
        data: {
            count
        }
    });
}