import { ObjectId, PipelineStage } from "mongoose";
import QuotationSchema from "../../schema/Quotation";
import { Error400 } from "../../utils/error";
import { formatNumber } from "../../utils/number";
import moment from "moment";

export interface QuotationQuery {
    year?: Date,
    page?: string,
    size?: string
}

export interface QuotationCreate {
    issue_date: Date;
    customers: Array<QuotationCustomer>;
}

class QuotationListResponse {
    message: string = "get quotation success";
    data: Quotation[];
    total_item: number;
    constructor(data: Quotation[], total_item: number) {
        this.data = data;
        this.total_item = total_item;
    }
}

export interface QuotationCustomer {
    company_name: string;
    plate_number: string;
    name: string;
    insurance_amount: string;
    amount: number;
    act_amount?: number;
    end_date: Date;
}

export class Quotation {
    _id?: ObjectId;
    issue_date: Date;
    customers: any;
    created_date?: Date;

    constructor(issueDate: Date, customers: Array<QuotationCustomer>) {
        this.issue_date = issueDate;
        this.customers = customers;
    }

    public static async create(quotationCreate: QuotationCreate): Promise<Quotation> {
        var customers = quotationCreate.customers.map(c => {
            if (!c.insurance_amount) throw new Error400("missing insurance_amount");
            if (!c.company_name) throw new Error400("missing company_name");
            if (!c.plate_number) throw new Error400("missing plate_number");
            if (!c.name) throw new Error400("missing name");
            if (!c.amount) throw new Error400("missing amount");
            if (!c.end_date) throw new Error400("missing end_date");

            let insuranceAmount = Number.parseFloat(c.insurance_amount.toString().replace(/,/g, ""));
            return {
                ...c,
                insurance_amount: Number.isNaN(insuranceAmount) ? c.insurance_amount : formatNumber(insuranceAmount),
                end_date: new Date(c.end_date)
            }
        });
        var quotation = new Quotation(quotationCreate.issue_date, customers);
        return await QuotationSchema.create(quotation);
    }

    public static async getList(quotationQuery: QuotationQuery) {
        const { year, page, size } = quotationQuery;
        if (page && Number.parseInt(page) < 1) throw new Error400("page must be positive number");
        if (size && Number.parseInt(size) < 1) throw new Error400("size must be positive number");
        var query = {};
        var aggregates: PipelineStage[] = [];

        if (year) {
            var startYear = moment(new Date(year)).startOf("year").toDate();
            var endYear = moment(new Date(year)).endOf("year").toDate();
            query = { issue_date: { $gte: startYear, $lte: endYear } };
        }
        aggregates.push({ $match: query });
        if (page !== undefined && size !== undefined) {
            aggregates.push({
                $facet: {
                    quotations: [
                        { $match: {} },
                        { $sort: { issue_date: -1 } },
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
        const data = await QuotationSchema.aggregate(aggregates);
        const list = data.length > 0 && data[0].total_item ? data[0].quotations : data;
        const totalItem = data.length > 0 && data[0].total_item && data[0].total_item[0] ? data[0].total_item[0].count : list.length;
        return new QuotationListResponse(list, totalItem);
    }
}