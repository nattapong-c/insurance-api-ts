import { Schema, model } from "mongoose";
import { User } from "../service/admin/admin.model";

const schema = new Schema<User>(
  {
    email: { type: String },
    role: { type: String },
  },
  {
    collection: "user",
  }
);

schema.index({ email: 1 }, { unique: true });
export default model("user", schema);
