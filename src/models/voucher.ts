import mongoose from "mongoose";

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
    conditions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const VoucherModel = mongoose.model<any>("Voucher", voucherSchema);
export default VoucherModel;
