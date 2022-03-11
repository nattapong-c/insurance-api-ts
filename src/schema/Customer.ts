import { Schema, model } from 'mongoose';
import { Customer } from '../service/customer/customer.model';

const schema = new Schema<Customer>(
    {
        plate_number: { type: String },
        name: { type: String },
    },
    { collection: "customer" }
);


schema.index({ plate_number: 1 }, { unique: true });
export default model("customer", schema);