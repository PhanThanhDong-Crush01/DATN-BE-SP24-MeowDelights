import mongoose from "mongoose";

const BillSchema = new mongoose.Schema<any>(
  {
    iduser: {
      type: String,
      require: true,
    },
    money: {
      type: Number,
      require: true,
    },
    date: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    idvc: {
      type: String,
      required: true,
    },
    paymentmethods: {
      type: String,
      required: true,
    },
    paymentstatus: {
      type: String,
      required: true,
    },
    orderstatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const BillModel = mongoose.model<any>("Bill", BillSchema);
export default BillModel;
