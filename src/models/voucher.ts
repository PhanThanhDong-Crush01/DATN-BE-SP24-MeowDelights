import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema<any>(
  {
    codevc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    decrease: {
      type: Number,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    conditions: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<any>("Voucher", voucherSchema);
