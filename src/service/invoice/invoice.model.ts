import { Error400 } from "../../utils/error";
import InvoiceSchema from "../../schema/Invoice";
import CustomerSchema from "../../schema/Customer";
import CompanySchema from "../../schema/Company";
import { PipelineStage, ObjectId } from "mongoose";
import { formatNumber } from "../../utils/number";

export interface InvoiceQuery {
    plate_number?: string,
    page?: string,
    size?: string
}

export interface InvoiceUpsert {
    invoice_no?: number;
    issue_date?: Date;
    insurance_type?: string;
    insurance_amount?: string;
    insurance_receiver_id?: string;
    insurance_no?: string;
    act_no?: string;
    plate_no?: string;
    amount?: number;
    amount_act?: number;
    amount_stamp?: number;
    is_company?: boolean;
    start_date?: Date;
    end_date?: Date;
}

class InvoiceListResponse {
    message: string = "get invoice success";
    data: Invoice[];
    total_item: number;
    constructor(data: Invoice[], total_item: number) {
        this.data = data;
        this.total_item = total_item;
    }
}

class InvoiceResponse {
    message: string = "get invoice success";
    data?: Invoice;
    constructor(message: string, data?: Invoice) {
        this.message = message;
        this.data = data;
    }
}

export class Invoice {
    _id?: ObjectId;
    customer_name?: string;
    invoice_no?: number;
    issue_date?: Date;
    insurance_type?: string;
    insurance_amount?: string;
    insurance_receiver?: string;
    insurance_no?: string;
    act_no?: string;
    plate_no?: string;
    amount?: number;
    amount_act?: number;
    amount_stamp?: number;
    vat_7?: number;
    is_company?: boolean;
    start_date?: Date;
    end_date?: Date;
    vat_at_paid?: number;
    total_amount_1?: number;
    total_amount_2?: number;
    total_amount_3?: number;
    company_address?: string;
    company_id?: string;

    constructor(
        customer_name?: string,
        invoice_no?: number,
        issue_date?: Date,
        insurance_type?: string,
        insurance_amount?: string,
        insurance_receiver?: string,
        insurance_no?: string,
        act_no?: string,
        plate_no?: string,
        amount?: number,
        amount_act?: number,
        amount_stamp?: number,
        vat_7?: number,
        start_date?: Date,
        end_date?: Date,
        vat_at_paid?: number,
        total_amount_1?: number,
        total_amount_2?: number,
        total_amount_3?: number,
        company_address?: string,
        company_id?: string
    ) {
        this.customer_name = customer_name;
        this.invoice_no = invoice_no;
        this.issue_date = issue_date;
        this.insurance_type = insurance_type;
        this.insurance_amount = insurance_amount;
        this.insurance_receiver = insurance_receiver;
        this.insurance_no = insurance_no;
        this.act_no = act_no;
        this.plate_no = plate_no;
        this.amount = amount;
        this.amount_act = amount_act;
        this.amount_stamp = amount_stamp;
        this.vat_7 = vat_7;
        this.start_date = start_date;
        this.end_date = end_date;
        this.vat_at_paid = vat_at_paid;
        this.total_amount_1 = total_amount_1;
        this.total_amount_2 = total_amount_2;
        this.total_amount_3 = total_amount_3;
        this.company_address = company_address;
        this.company_id = company_id;
    }

    public static async getList(invoiceQuery: InvoiceQuery): Promise<InvoiceListResponse> {
        const { plate_number, page, size } = invoiceQuery;
        if (page && Number.parseInt(page) < 1) throw new Error400("page must be positive number");
        if (size && Number.parseInt(size) < 1) throw new Error400("size must be positive number");
        var query = {};
        var aggregates: PipelineStage[] = [];

        if (plate_number) query = { plate_no: { $regex: new RegExp(`${plate_number}`) } };
        aggregates.push({ $match: query });
        if (page !== undefined && size !== undefined) {
            aggregates.push({
                $facet: {
                    invoices: [
                        { $match: {} },
                        { $sort: { invoice_no: -1 } },
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
        const data = await InvoiceSchema.aggregate(aggregates);
        const list = data.length > 0 && data[0].total_item ? data[0].invoices : data;
        const totalItem = data.length > 0 && data[0].total_item && data[0].total_item[0] ? data[0].total_item[0].count : list.length;

        return new InvoiceListResponse(list, totalItem);
    }

    public static async upsert(invoice: InvoiceUpsert): Promise<Invoice | null> {
        let {
            invoice_no,
            issue_date,
            insurance_type,
            insurance_amount,
            insurance_receiver_id,
            insurance_no,
            act_no,
            plate_no,
            amount,
            amount_act,
            amount_stamp,
            is_company,
            start_date,
            end_date
        } = invoice;

        if (!invoice_no) throw new Error400("missing invoice_no");
        if (!plate_no) throw new Error400("missing plate_no");
        if (!insurance_type) throw new Error400("missing insurance_type");
        if (!insurance_amount) throw new Error400("missing insurance_amount");
        if (!insurance_receiver_id) throw new Error400("missing insurance_receiver_id");
        if (!insurance_no) throw new Error400("missing insurance_no");
        if (!issue_date) throw new Error400("missing issue_date");
        issue_date = new Date(issue_date);
        if (Number.isNaN(issue_date.getTime())) throw new Error400("invalid issue_date");

        if (!start_date) throw new Error400("missing start_date");
        start_date = new Date(start_date);
        if (Number.isNaN(start_date.getTime())) throw new Error400("invalid start_date");

        if (!end_date) throw new Error400("missing end_date");
        end_date = new Date(end_date);
        if (Number.isNaN(end_date.getTime())) throw new Error400("invalid end_date");

        if (is_company === null) throw new Error400("missing is_company");

        if (!amount) throw new Error400("missing amount");
        amount = Number.parseFloat(amount.toString());
        if (Number.isNaN(amount)) throw new Error400("amount must be number");
        if (amount_act) {
            amount_act = Number.parseFloat(amount_act.toString());
            if (Number.isNaN(amount_act)) throw new Error400("amount_act must be number");
        }
        if (!amount_stamp) throw new Error400("missing amount_stamp");
        amount_stamp = Number.parseFloat(amount_stamp.toString());
        if (Number.isNaN(amount_stamp)) throw new Error400("amount_stamp must be number");

        let insuranceAmount = Number.parseFloat(insurance_amount.replace(/,/g, ""));
        insurance_amount = Number.isNaN(insuranceAmount) ? insurance_amount : formatNumber(insuranceAmount);

        var customer = await CustomerSchema.findOne({ plate_number: plate_no });
        if (!customer) throw new Error400("customer not found");

        var company = await CompanySchema.findOne({ id_company: insurance_receiver_id });
        if (!company) throw new Error400("company not found");

        let totalAmount1 = amount_act ? amount + amount_act + amount_stamp : amount + amount_stamp;
        let vat7 = (totalAmount1 * 7) / 100;
        let totalAmount2 = totalAmount1 + vat7;
        let vatAtPaid = is_company ? totalAmount1 / 100 : 0;
        let totalAmount3 = is_company ? totalAmount2 - vatAtPaid : totalAmount2;

        var invoiceData = new Invoice(
            customer.name,
            invoice_no,
            issue_date,
            insurance_type,
            insurance_amount,
            company.name,
            insurance_no,
            act_no,
            plate_no,
            amount,
            amount_act,
            amount_stamp,
            vat7,
            start_date,
            end_date,
            vatAtPaid,
            totalAmount1,
            totalAmount2,
            totalAmount3,
            company.address,
            company.id_company
        );

        var existInvoice = await InvoiceSchema.findOne({ invoice_no });
        if (!existInvoice) {
            try {
                existInvoice = await InvoiceSchema.create(invoiceData);
            } catch (err: unknown) {
                var error = err as Error;
                throw new Error400(error.message);
            }
        } else {
            existInvoice = await InvoiceSchema.findOneAndUpdate(
                { invoice_no },
                { $set: invoiceData },
                { new: true }
            );
        }
        return existInvoice;
    }

    public static async get(invoiceNumber: string): Promise<Invoice> {
        const invoice = await InvoiceSchema.findOne({ invoice_no: invoiceNumber });
        if (!invoice) throw new Error400("invoice not found");
        return invoice;
    }

    public static async delete(idList: string[]): Promise<InvoiceResponse> {
        await InvoiceSchema.deleteMany({ _id: { $in: idList } });
        return new InvoiceResponse("delete company success");
    }

    public static async info(): Promise<any> {
        const [count, latestNumber] = await Promise.all([
            InvoiceSchema.countDocuments(),
            InvoiceSchema.findOne().sort({ invoice_no: -1 })
        ]);
        return { count, latest_number: latestNumber ? latestNumber.invoice_no : 100 }
    }

}