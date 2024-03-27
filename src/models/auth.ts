
import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      // required: true,
      // Hash the password before saving to the database
    },
    role: {
      type: String,
      default: "member",
    },
    phone: {
      type: String,
    },
    gender: {
      type: Boolean,
    },
    address: {
      type: String,
    },
    imgUser: {
      type: String,
    },
    discount_points: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    jobPosition: {
      type: String,
    },
    employee: {
      type: String,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    dateIsLockedTrue: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const AuthModel = mongoose.model("Auth", authSchema);
export default AuthModel;
