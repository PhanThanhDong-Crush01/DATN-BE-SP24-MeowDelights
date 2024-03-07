import { string } from "joi";
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
      type: Date,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    tel: {
      type: Number,
      required: true,
    },
    idvc: {
      type: String,
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
//gộp
const OrderDetailSchema = new mongoose.Schema<any>(
  {
    idbill: {
      type: String,
      required: true,
    },
    iduser: {
      type: String,
      // required: true,
    },
    idpro: {
      type: String,
      required: true,
    },
    idprotype: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const OrderDetailModel = mongoose.model<any>(
  "OrderDetail",
  OrderDetailSchema
);
