import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const UserModel = model("User", UserSchema);
