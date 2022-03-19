import { ObjectId, PipelineStage, Types } from "mongoose";
import QuotationSchema from "../../schema/Quotation";
import CustomerSchema from "../../schema/Customer";
import CompanySchema from "../../schema/Company";
import { Error400 } from "../../utils/error";
import { formatNumber } from "../../utils/number";
import moment from "moment";
import _ from "lodash";
import { Customer } from "../customer/customer.model";
import { Company } from "../company/company.model";

export interface QuotationQuery {
    year?: Date,
    page?: string,
    size?: string
}

export interface QuotationCreate {
    issue_date: Date;
    customers: Array<QuotationCustomerCreate>;
}

export interface QuotationCustomerCreate {
    company_id: string;
    customer_id: string;
    insurance_amount: string;
    amount: number;
    act_amount?: number;
    end_date: Date;
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

class QuotationResponse {
    message: string = "get quotation success";
    data?: Quotation;
    constructor(message: string, data?: Quotation) {
        this.message = message;
        this.data = data;
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

    public static async upsert(quotationCreate: QuotationCreate, quotationId?: string): Promise<Quotation> {
        var companyIdList = quotationCreate.customers.map(c => c.company_id);
        var customerIdList = quotationCreate.customers.map(c => c.customer_id);

        const [companies, customers] = await Promise.all([
            CompanySchema.find({ _id: { $in: companyIdList } }),
            CustomerSchema.find({ _id: { $in: customerIdList } })
        ]);

        var customerData: QuotationCustomer[] = [];

        for (let c of quotationCreate.customers) {
            if (!c.insurance_amount) throw new Error400("missing insurance_amount");
            if (!c.company_id) throw new Error400("missing company_id");
            if (!c.customer_id) throw new Error400("missing customer_id");
            if (!c.amount) throw new Error400("missing amount");
            if (!c.end_date) throw new Error400("missing end_date");

            let company = _.find(companies, { _id: new Types.ObjectId(c.company_id) });
            let customer = _.find(customers, { _id: new Types.ObjectId(c.customer_id) });

            if (!company) throw new Error400("company not found");
            if (!customer) throw new Error400("customer not found");

            let customerName = ((customer.valueOf() as Customer).name.split("<br/>")[0]).split("/");

            let insuranceAmount = Number.parseFloat(c.insurance_amount.toString().replace(/,/g, ""));
            customerData.push({
                company_name: (company as Company).name,
                plate_number: (customer.valueOf() as Customer).plate_number,
                name: customerName[customerName.length - 1],
                insurance_amount: Number.isNaN(insuranceAmount) ? c.insurance_amount : formatNumber(insuranceAmount),
                amount: c.amount,
                act_amount: c.act_amount,
                end_date: new Date(c.end_date)
            });
        }

        var quotation = new Quotation(quotationCreate.issue_date, customerData);
        if (!quotationId) {
            return await QuotationSchema.create(quotation);
        } else {
            var quotationUpdated = await QuotationSchema.findByIdAndUpdate(
                { _id: quotationId },
                { $set: quotation },
                { new: true }
            );
            if (!quotationUpdated) throw new Error400("quotation not found");
            return quotationUpdated;
        }

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

    public static async get(quotationId: string): Promise<Quotation> {
        const quotation = await QuotationSchema.findById(quotationId);
        if (!quotation) throw new Error400("quotation not found");
        return quotation;
    }

    public static async delete(idList: string[]): Promise<QuotationResponse> {
        await QuotationSchema.deleteMany({ _id: { $in: idList } });
        return new QuotationResponse("delete quotation success");
    }
}