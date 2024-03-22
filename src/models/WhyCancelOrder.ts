import { boolean } from "joi";
import mongoose from "mongoose";

const whyCancelOrderSchema = new mongoose.Schema<any>(
  {
    idbill: {
      type: String,
      required: true,
    },
    iduser: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    ExistsInStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const WhyCancelOrderModel = mongoose.model<any>(
  "WhyCancelOrder",
  whyCancelOrderSchema
);
export default WhyCancelOrderModel;
