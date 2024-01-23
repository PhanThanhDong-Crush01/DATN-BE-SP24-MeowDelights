import mongoose from "mongoose";
import { Voucher } from "../interface/IVoucher";

const voucherSchema = new mongoose.Schema<any>(
  {
    CodeVC: {
      type: Number,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    Decrease: {
      type: Number,
      required: true,
    },
    Expiry: {
      type: String,
      required: true,
    },
    Conditions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<any>("Voucher", voucherSchema);
