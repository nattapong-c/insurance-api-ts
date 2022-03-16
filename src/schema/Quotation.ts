import { Schema, model } from 'mongoose';
import { Quotation } from '../service/quotation/quotation.model';

const schema = new Schema<Quotation>(
    {
        issue_date: {
            type: Date
        },
        customers: {
            type: Array,
            company_name: {
                type: String
            },
            plate_number: {
                type: String
            },
            insurance_amount: {
                type: String
            },
            amount: {
                type: Number
            },
            act_amount: {
                type: Number
            },
            end_date: {
                type: Date
            }
        },
        created_date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: "quotation" }
);


export default model("quotation", schema);