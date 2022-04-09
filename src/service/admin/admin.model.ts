import { ObjectId } from "mongoose";
import UserSchema from "../../schema/User";

export class User {
  _id?: ObjectId;
  email: string;
  role: string;

  constructor(email: string, role: string) {
    this.email = email;
    this.role = role;
  }

  public static async getByEmail(email: string): Promise<User | null> {
    const user = await UserSchema.findOne({ email });
    return user;
  }
}
