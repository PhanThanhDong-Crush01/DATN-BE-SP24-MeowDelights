import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema<any>(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      // required: true,
    },
    quantity: {
      type: Number,
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
    idTypeVoucher: {
      type: String,
      required: true,
    },
    ExistsInStock: {
      type: Boolean,
    },
  },
  { timestamps: true, versionKey: false }
);

const VoucherModel = mongoose.model<any>("Voucher", voucherSchema);
export default VoucherModel;
