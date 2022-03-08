import { Schema, model } from 'mongoose';
import { Customer } from '../customer/customer.model';

const schema = new Schema<Customer>(
    {
        plate_number: { type: String },
        name: { type: String },
    },
    { collection: "customer" }
);

// @ts-ignore
if (!global.describe) schema.index({ plate_number: 1 }, { unique: true });

export default model("customer", schema);