import { Error400 } from "../utils/error";
import customer from "../schema/Customer";
import { PipelineStage, Aggregate } from "mongoose";

export interface CustomerQuery {
    plate_number?: string,
    page?: string,
    size?: string
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

export class Customer {
    // constructor(plate_number: string, name: string) { }

    public static async getList(plateNumber?: string, page?: string, size?: string): Promise<CustomerListResponse> {
        if (page && Number.parseInt(page) < 1) throw new Error400("page must be positive number");
        if (size && Number.parseInt(size) < 1) throw new Error400("size must be positive number");
        var query = {};
        var aggregates: PipelineStage[] = [];

        if (plateNumber) query = { plate_number: { $regex: new RegExp(`${plateNumber}`) } };
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
        const data = await customer.aggregate(aggregates);
        const list = data[0].total_item ? data[0].customers : data;
        const totalItem = data[0].total_item ? data[0].total_item[0].count : data.length

        return new CustomerListResponse(list, totalItem);
    }
}