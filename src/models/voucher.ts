import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema<any>(
  {
    name: {
      type: String,
      // required: true,
    },
    status: {
      type: Boolean,
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    decrease: {
      type: Number,
      // required: true,
    },
    startDate: {
      type: String,
      //required: true,
    },
    expiry: {
      type: String,
      // required: true,
    },
    conditions: {
      type: Number,
      // required: true,
    },
    idTypeVoucher: {
      type: String,
      // required: true,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },

    //phan phat voucher
    minTotalBill1: {
      type: Number,
    },
    quantity1: {
      type: Number,
    },
    minTotalBill2: {
      type: Number,
    },
    quantity2: {
      type: Number,
    },
    minTotalBill3: {
      type: Number,
    },
    quantity3: {
      type: Number,
    },
    minTotalBill4: {
      type: Number,
    },
    quantity4: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const VoucherModel = mongoose.model<any>("Voucher", voucherSchema);
export default VoucherModel;
