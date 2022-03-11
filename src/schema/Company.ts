import { Schema, model } from 'mongoose';
import { Company } from '../service/company/company.model';

const schema = new Schema<Company>(
    {
        id_company: { type: String },
        name: { type: String },
        address: { type: String },
    },
    { collection: "company" }
);


schema.index({ id_company: 1 }, { unique: true });
export default model("company", schema);