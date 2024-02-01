import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "member",
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    imgUser: {
      type: String,
      required: false,
    },
    authorized_accounts: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const AuthModel = mongoose.model("Auth", authSchema);
export default AuthModel;
