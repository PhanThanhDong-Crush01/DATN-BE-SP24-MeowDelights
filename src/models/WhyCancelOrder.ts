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
    idpro: {
      type: String,
      required: true,
    },
    idprotype: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const WhyCancelOrderModel = mongoose.model<any>(
  "WhyCancelOrder",
  whyCancelOrderSchema
);
export default WhyCancelOrderModel;
