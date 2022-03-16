import { Error400 } from "../../utils/error";
import CustomerSchema from "../../schema/Customer";
import { PipelineStage, ObjectId } from "mongoose";

export interface CustomerQuery {
    plate_number?: string,
    page?: string,
    size?: string
}

export interface CustomerCreate {
    plate_number: string,
    name: string
}

export interface CustomerUpdate {
    plate_number?: string,
    name?: string
}

class CustomerListResponse {
    message: string = "get customer success";
    data: Customer[];
    total_item: number;
    constructor(data: Customer[], total_item: number) {
        this.data = data;
        this.total_item = total_item;
    }
}

class CustomerResponse {
    message: string = "get customer success";
    data?: Customer;

    constructor(message: string, data?: Customer) {
        this.message = message;
        this.data = data;
    }
}

export class Customer {
    _id?: ObjectId;
    plate_number: string;
    name: string;
    constructor(plate_number: string, name: string) {
        this.plate_number = plate_number;
        this.name = name;
    }

    public static async getList(customerQuery: CustomerQuery): Promise<CustomerListResponse> {
        const { plate_number, page, size } = customerQuery;
        if (page && Number.parseInt(page) < 1) throw new Error400("page must be positive number");
        if (size && Number.parseInt(size) < 1) throw new Error400("size must be positive number");
        var query = {};
        var aggregates: PipelineStage[] = [];

        if (plate_number) query = { plate_number: { $regex: new RegExp(`${plate_number}`) } };
        aggregates.push({ $match: query });
        if (page !== undefined && size !== undefined) {
            aggregates.push({
                $facet: {
                    customers: [
                        { $match: {} },
                        { $sort: { plate_number: 1 } },
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
        const data = await CustomerSchema.aggregate(aggregates);
        const list = data.length > 0 && data[0].total_item ? data[0].customers : data;
        const totalItem = data.length > 0 && data[0].total_item && data[0].total_item[0] ? data[0].total_item[0].count : list.length;

        return new CustomerListResponse(list, totalItem);
    }

    public static async create(customerCreate: CustomerCreate): Promise<CustomerResponse> {
        if (!customerCreate.name) throw new Error400("missing name");
        if (!customerCreate.plate_number) throw new Error400("missing plate_number");
        
        var newCustomer = new Customer(customerCreate.plate_number, customerCreate.name);
        try {
            newCustomer = await CustomerSchema.create(newCustomer);
            return new CustomerResponse("create customer success", newCustomer);
        } catch (err: unknown) {
            var error = err as Error;
            throw new Error400(error.message);
        }
    }

    public static async update(id: string, customerUpdate: CustomerUpdate): Promise<CustomerResponse> {
        var customer = await CustomerSchema.findByIdAndUpdate(
            { _id: id },
            { $set: customerUpdate },
            { new: true }
        );
        if (!customer) throw new Error400("customer not found");
        return new CustomerResponse("update customer success", customer);
    }

    public static async delete(idList: string[]): Promise<CustomerResponse> {
        await CustomerSchema.deleteMany({ _id: { $in: idList } });
        return new CustomerResponse("delete customer success");
    }

    public static async count(): Promise<number> {
        return await CustomerSchema.countDocuments();
    }
}