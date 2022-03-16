import { Error400 } from "../../utils/error";
import CompanySchema from "../../schema/Company";
import { PipelineStage, ObjectId } from "mongoose";

export interface CompanyQuery {
    name?: string,
    page?: string,
    size?: string
}

export interface CompanyCreate {
    name: string,
    id_company: string,
    address: string
}

export interface CompanyUpdate {
    name?: string,
    id_company?: string,
    address?: string
}

class CompanyListResponse {
    message: string = "get company success";
    data: Company[];
    total_item: number;
    constructor(data: Company[], total_item: number) {
        this.data = data;
        this.total_item = total_item;
    }
}

class CompanyResponse {
    message: string = "get company success";
    data?: Company;

    constructor(message: string, data?: Company) {
        this.message = message;
        this.data = data;
    }
}


export class Company {
    _id?: ObjectId;
    id_company: string;
    name: string;
    address: string;

    constructor(id_company: string, name: string, address: string) {
        this.id_company = id_company;
        this.name = name;
        this.address = address;
    }

    public static async getList(companyQuery: CompanyQuery): Promise<CompanyListResponse> {
        const { name, page, size } = companyQuery;
        if (page && Number.parseInt(page) < 1) throw new Error400("page must be positive number");
        if (size && Number.parseInt(size) < 1) throw new Error400("size must be positive number");
        var query = {};
        var aggregates: PipelineStage[] = [];

        if (name) query = { name: { $regex: new RegExp(`${name}`) } };
        aggregates.push({ $match: query });
        if (page !== undefined && size !== undefined) {
            aggregates.push({
                $facet: {
                    companies: [
                        { $match: {} },
                        { $sort: { name: 1 } },
                        { $skip: (Number.parseInt(page) - 1) * Number.parseInt(size) },
                        { $limit: Number.parseInt(size) }
                    ],
                    total_item: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            });
        }
        const data = await CompanySchema.aggregate(aggregates);
        const list = data.length > 0 && data[0].total_item ? data[0].companies : data;
        const totalItem = data.length > 0 && data[0].total_item && data[0].total_item[0] ? data[0].total_item[0].count : list.length;

        return new CompanyListResponse(list, totalItem);
    }

    public static async create(companyCreate: CompanyCreate): Promise<CompanyResponse> {
        if (!companyCreate.address) throw new Error400("missing address");
        if (!companyCreate.id_company) throw new Error400("missing id_company");
        if (!companyCreate.name) throw new Error400("missing name");

        var newCompany = new Company(companyCreate.id_company, companyCreate.name, companyCreate.address);
        try {
            newCompany = await CompanySchema.create(newCompany);
            return new CompanyResponse("create company success", newCompany);
        } catch (err: unknown) {
            var error = err as Error;
            throw new Error400(error.message);
        }
    }

    public static async update(id: string, companyUpdate: CompanyUpdate): Promise<CompanyResponse> {
        var company = await CompanySchema.findByIdAndUpdate(
            { _id: id },
            { $set: companyUpdate },
            { new: true }
        );
        if (!company) throw new Error400("company not found");
        return new CompanyResponse("update company success", company);
    }

    public static async delete(idList: string[]): Promise<CompanyResponse> {
        await CompanySchema.deleteMany({ _id: { $in: idList } });
        return new CompanyResponse("delete company success");
    }

    public static async count(): Promise<number> {
        return await CompanySchema.countDocuments();
    }
}