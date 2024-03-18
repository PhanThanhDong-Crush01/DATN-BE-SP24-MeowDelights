import { boolean } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    imgUser: {
      type: String,
    },
    gender: {
      type: Boolean,
    },
    age: {
      type: Number,
    },
    authorized_accounts: {
      type: String,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
