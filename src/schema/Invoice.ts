import { Schema, model } from 'mongoose';
import { Invoice } from '../service/invoice/invoice.model';

const schema = new Schema<Invoice>(
    {
        customer_name: {
            type: String
        },
        invoice_no: {
            type: Number
        },
        issue_date: {
            type: Date
        },
        insurance_type: {
            type: String
        },
        insurance_amount: {
            type: String
        },
        insurance_receiver: {
            type: String
        },
        insurance_no: {
            type: String
        },
        act_no: {
            type: String
        },
        plate_no: {
            type: String
        },
        amount: {
            type: Number
        },
        amount_act: {
            type: Number
        },
        amount_stamp: {
            type: Number
        },
        vat_7: {
            type: Number
        },
        is_company: {
            type: Boolean
        },
        start_date: {
            type: Date
        },
        end_date: {
            type: Date
        },
        vat_at_paid: {
            type: Number
        },
        total_amount_1: {
            type: Number
        },
        total_amount_2: {
            type: Number
        },
        total_amount_3: {
            type: Number
        },
        company_address: {
            type: String
        },
        company_id: {
            type: String
        }
    },
    { collection: "invoice" }
);


schema.index({ invoice_no: 1 }, { unique: true });
export default model("invoice", schema);