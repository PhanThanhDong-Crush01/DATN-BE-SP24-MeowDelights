import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema<any>(
  {
    codevc: {
      type: Number,
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
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const VoucherModel = mongoose.model<any>("Voucher", voucherSchema);
export default VoucherModel;
